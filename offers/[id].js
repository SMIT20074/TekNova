import { supabaseServer } from '../_supabaseServer.js';

export default async function handler(req, res) {
  const { id } = req.query;

  // PATCH /api/offers/:id -> seller accepts or rejects an offer
  if (req.method === 'PATCH') {
    const { status } = req.body; // 'accepted' or 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be accepted or rejected' });
    }

    const { data: offer, error } = await supabaseServer
      .from('offers')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    // If accepted, mark the listing as pending (reserved for this buyer)
    if (status === 'accepted') {
      await supabaseServer
        .from('listings')
        .update({ status: 'pending' })
        .eq('id', offer.listing_id);
    }

    return res.status(200).json(offer);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
