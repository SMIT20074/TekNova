import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer.js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const listing_id = searchParams.get('listing_id');

  const { data, error } = await supabaseServer
    .from('offers')
    .select('*, profiles:buyer_id(full_name)')
    .eq('listing_id', listing_id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}

export async function POST(request) {
  const { listing_id, buyer_id, offer_amount } = await request.json();

  if (!listing_id || !buyer_id || !offer_amount) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from('offers')
    .insert({ listing_id, buyer_id, offer_amount })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
