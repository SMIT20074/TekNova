import { supabaseServer } from './_supabaseServer.js';

export default async function handler(req, res) {
  // GET /api/impact -> Impact Dashboard page data
  if (req.method === 'GET') {
    const { data: stats, error: statsError } = await supabaseServer
      .from('impact_stats')
      .select('*')
      .single();

    const { data: leaders, error: leadersError } = await supabaseServer
      .from('exchange_leaders')
      .select('*');

    if (statsError || leadersError) {
      return res.status(500).json({ error: (statsError || leadersError).message });
    }

    return res.status(200).json({ stats, leaders });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
