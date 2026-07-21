import { supabaseServer } from './_supabaseServer.js';

// TODO: Replace this with your actual college email domain once you have it
const ALLOWED_DOMAINS = ['yourcollege.edu.in'];

export default async function handler(req, res) {
  // POST /api/request-login -> validates college email, then sends magic link
  if (req.method === 'POST') {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const domain = email.split('@')[1];
    if (!ALLOWED_DOMAINS.includes(domain)) {
      return res.status(403).json({ error: 'Only college email addresses are allowed to sign up.' });
    }

    const { error } = await supabaseServer.auth.signInWithOtp({ email });

    if (error) return res.status(500).json({ error: error.message });

    // Create/update their profile as verified since domain matched
    await supabaseServer
      .from('profiles')
      .upsert({ college_email: email, is_verified: true }, { onConflict: 'college_email' });

    return res.status(200).json({ message: 'Login link sent to your college email.' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
