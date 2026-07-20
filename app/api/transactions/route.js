import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer.js';

export async function POST(request) {
  const { listing_id, buyer_id, seller_id, amount } = await request.json();

  if (!listing_id || !buyer_id || !seller_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from('transactions')
    .insert({ listing_id, buyer_id, seller_id, amount, status: 'initiated' })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(request) {
  const { transaction_id, status } = await request.json();

  const { data, error } = await supabaseServer
    .from('transactions')
    .update({ status })
    .eq('id', transaction_id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // if completed, also mark the listing as sold
  if (status === 'completed') {
    await supabaseServer
      .from('listings')
      .update({ status: 'sold' })
      .eq('id', data.listing_id);
  }

  return NextResponse.json(data, { status: 200 });
}
