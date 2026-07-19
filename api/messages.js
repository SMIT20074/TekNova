import { supabaseServer } from './_supabaseServer.js';

export default async function handler(req, res) {
  // GET /api/messages?listing_id=xxx&user_id=xxx -> chat thread for a listing
  if (req.method === 'GET') {
    const { listing_id, user_id } = req.query;

    const { data, error } = await supabaseServer
      .from('messages')
      .select('*')
      .eq('listing_id', listing_id)
      .or(`sender_id.eq.${user_id},receiver_id.eq.${user_id}`)
      .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // POST /api/messages -> send a chat message
  if (req.method === 'POST') {
    const { listing_id, sender_id, receiver_id, content } = req.body;

    if (!listing_id || !sender_id || !receiver_id || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabaseServer
      .from('messages')
      .insert({ listing_id, sender_id, receiver_id, content })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
