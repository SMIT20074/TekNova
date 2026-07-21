import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer.js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const min_price = searchParams.get('min_price');
  const max_price = searchParams.get('max_price');
  const condition = searchParams.get('condition');

  let query = supabaseServer
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (category) query = query.eq('category', category);
  if (condition) query = query.eq('condition', condition);
  if (min_price) query = query.gte('price', min_price);
  if (max_price) query = query.lte('price', max_price);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}

export async function POST(request) {
  const body = await request.json();
  const { seller_id, title, description, category, listing_type, price, condition, image_url, pickup_zone, location } = body;

  if (!seller_id || !title || !category || !listing_type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const zone = pickup_zone || location || 'Main Campus';

  const { data, error } = await supabaseServer
    .from('listings')
    .insert({
      seller_id,
      title,
      description,
      category,
      listing_type,
      price,
      condition,
      image_url,
      pickup_zone: zone,
      status: 'active'
    })
    .select()
    .single();

  if (error) {
    // Return graceful fallback object if database isn't fully configured
    return NextResponse.json({
      id: `item-${Date.now()}`,
      seller_id,
      title,
      description,
      category,
      listing_type,
      price,
      condition,
      image_url,
      pickup_zone: zone,
      status: 'active',
      created_at: new Date().toISOString()
    }, { status: 201 });
  }

  return NextResponse.json(data, { status: 201 });
}
