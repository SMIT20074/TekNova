import { supabaseServer } from './_supabaseServer.js';

export default async function handler(req, res) {
  // POST /api/ratings -> leave a rating after a completed deal
  if (req.method === 'POST') {
    const { transaction_id, rater_id, rated_id, score, comment } = req.body;

    if (!transaction_id || !rater_id || !rated_id || !score) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabaseServer
      .from('ratings')
      .insert({ transaction_id, rater_id, rated_id, score, comment })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

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

    return res.status(201).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
