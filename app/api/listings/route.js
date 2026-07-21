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
  const { seller_id, title, description, category, listing_type, price, condition, image_url, pickup_zone } = await request.json();

  if (!seller_id || !title || !category || !listing_type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from('listings')
    .insert({ seller_id, title, description, category, listing_type, price, condition, image_url, pickup_zone })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
