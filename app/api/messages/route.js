import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer.js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const listing_id = searchParams.get('listing_id');
  const user_id = searchParams.get('user_id');

  const { data, error } = await supabaseServer
    .from('messages')
    .select('*')
    .eq('listing_id', listing_id)
    .or(`sender_id.eq.${user_id},receiver_id.eq.${user_id}`)
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}

export async function POST(request) {
  const { listing_id, sender_id, receiver_id, content } = await request.json();

  if (!listing_id || !sender_id || !receiver_id || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from('messages')
    .insert({ listing_id, sender_id, receiver_id, content })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
