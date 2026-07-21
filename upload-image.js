import { supabaseServer } from './_supabaseServer.js';

export default async function handler(req, res) {
  // POST /api/upload-image -> get a signed URL to upload a listing photo
  if (req.method === 'POST') {
    const { user_id, file_name } = req.body;

    if (!user_id || !file_name) {
      return res.status(400).json({ error: 'Missing user_id or file_name' });
    }

    const filePath = `${user_id}/${Date.now()}-${file_name}`;

    const { data, error } = await supabaseServer
      .storage
      .from('listing-images')
      .createSignedUploadUrl(filePath);

    if (error) return res.status(500).json({ error: error.message });

    // Public URL the image will have once uploaded
    const { data: publicUrlData } = supabaseServer
      .storage
      .from('listing-images')
      .getPublicUrl(filePath);

    return res.status(200).json({
      uploadUrl: data.signedUrl,
      path: data.path,
      publicUrl: publicUrlData.publicUrl
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
