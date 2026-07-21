// Shared server-side Supabase client
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceKey) {
  console.warn('Supabase environment variables missing. Verify SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
}

export const supabaseServer = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  serviceKey || 'placeholder-key'
);

