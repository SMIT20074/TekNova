import { supabaseServer } from './_supabaseServer.js';

export default async function handler(req, res) {
  // POST /api/transactions -> start a transaction (buyer scans QR / confirms deal)
  if (req.method === 'POST') {
    const { listing_id, buyer_id, seller_id, amount } = req.body;

    if (!listing_id || !buyer_id || !seller_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabaseServer
      .from('transactions')
      .insert({ listing_id, buyer_id, seller_id, amount, status: 'initiated' })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  // PATCH /api/transactions -> mark as completed (after QR payment confirms)
  if (req.method === 'PATCH') {
    const { transaction_id, status } = req.body;

    const { data, error } = await supabaseServer
      .from('transactions')
      .update({ status })
      .eq('id', transaction_id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    // if completed, also mark the listing as sold
    if (status === 'completed') {
      await supabaseServer
        .from('listings')
        .update({ status: 'sold' })
        .eq('id', data.listing_id);
    }

    return res.status(200).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
