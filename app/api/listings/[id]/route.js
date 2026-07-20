import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabaseServer.js';

export async function GET(request, { params }) {
  const { id } = await params;

  const { data, error } = await supabaseServer
    .from('listings')
    .select('*, profiles:seller_id(full_name, rating, is_verified)')
    .eq('id', id)
    .single();

  if (error) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });

  // increment view count (fire and forget)
  supabaseServer
    .from('listings')
    .update({ views_count: (data.views_count || 0) + 1 })
    .eq('id', id)
    .then(() => {});

  return NextResponse.json(data, { status: 200 });
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const { status } = await request.json();

  const { data, error } = await supabaseServer
    .from('listings')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}
