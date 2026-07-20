import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer.js';

export async function GET(request) {
  const { data: stats, error: statsError } = await supabaseServer
    .from('impact_stats')
    .select('*')
    .single();

  const { data: leaders, error: leadersError } = await supabaseServer
    .from('exchange_leaders')
    .select('*');

  if (statsError || leadersError) {
    return NextResponse.json({ error: (statsError || leadersError).message }, { status: 500 });
  }

  return NextResponse.json({ stats, leaders }, { status: 200 });
}
