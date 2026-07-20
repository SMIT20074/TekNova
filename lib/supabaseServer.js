// Shared server-side Supabase client
// Uses the SERVICE ROLE key in production/Vercel, and falls back to NEXT_PUBLIC keys for local dev.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseServer = createClient(supabaseUrl, serviceKey);
