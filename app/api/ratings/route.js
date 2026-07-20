import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer.js';

export async function POST(request) {
  const { transaction_id, rater_id, rated_id, score, comment } = await request.json();

  if (!transaction_id || !rater_id || !rated_id || !score) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from('ratings')
    .insert({ transaction_id, rater_id, rated_id, score, comment })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // recalculate the rated user's average rating
  const { data: allRatings } = await supabaseServer
    .from('ratings')
    .select('score')
    .eq('rated_id', rated_id);

  const avg = allRatings.reduce((sum, r) => sum + r.score, 0) / allRatings.length;

  await supabaseServer
    .from('profiles')
    .update({ rating: avg })
    .eq('id', rated_id);

  return NextResponse.json(data, { status: 201 });
}
