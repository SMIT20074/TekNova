import { supabaseServer } from '../_supabaseServer.js';

export default async function handler(req, res) {
  const { id } = req.query;

  // GET /api/listings/:id -> item details page
  if (req.method === 'GET') {
    const { data, error } = await supabaseServer
      .from('listings')
      .select('*, profiles:seller_id(full_name, rating, is_verified)')
      .eq('id', id)
      .single();

    if (error) return res.status(404).json({ error: 'Listing not found' });

    // increment view count (fire and forget)
    supabaseServer
      .from('listings')
      .update({ views_count: (data.views_count || 0) + 1 })
      .eq('id', id)
      .then(() => {});

    return res.status(200).json(data);
  }

  // PATCH /api/listings/:id -> update status (e.g. mark as sold)
  if (req.method === 'PATCH') {
    const { status } = req.body;
    const { data, error } = await supabaseServer
      .from('listings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
