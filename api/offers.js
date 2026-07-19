import { supabaseServer } from './_supabaseServer.js';

export default async function handler(req, res) {
  // POST /api/offers -> "Make an Offer" button
  if (req.method === 'POST') {
    const { listing_id, buyer_id, offer_amount } = req.body;

    if (!listing_id || !buyer_id || !offer_amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabaseServer
      .from('offers')
      .insert({ listing_id, buyer_id, offer_amount })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  // GET /api/offers?listing_id=xxx -> seller sees offers on their item
  if (req.method === 'GET') {
    const { listing_id } = req.query;
    const { data, error } = await supabaseServer
      .from('offers')
      .select('*, profiles:buyer_id(full_name)')
      .eq('listing_id', listing_id)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
