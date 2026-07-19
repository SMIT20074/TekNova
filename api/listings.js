import { supabaseServer } from './_supabaseServer.js';

export default async function handler(req, res) {
  // GET /api/listings -> browse marketplace (with optional filters)
  if (req.method === 'GET') {
    const { category, min_price, max_price, condition } = req.query;

    let query = supabaseServer
      .from('listings')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (category) query = query.eq('category', category);
    if (condition) query = query.eq('condition', condition);
    if (min_price) query = query.gte('price', min_price);
    if (max_price) query = query.lte('price', max_price);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // POST /api/listings -> create a new listing
  if (req.method === 'POST') {
    const { seller_id, title, description, category, listing_type, price, condition, image_url, pickup_zone } = req.body;

    if (!seller_id || !title || !category || !listing_type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabaseServer
      .from('listings')
      .insert({ seller_id, title, description, category, listing_type, price, condition, image_url, pickup_zone })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
