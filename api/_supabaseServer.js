// Shared server-side Supabase client
// Uses the SERVICE ROLE key (secret) — only used here on the backend, never in frontend code.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseServer = createClient(supabaseUrl, serviceKey);
