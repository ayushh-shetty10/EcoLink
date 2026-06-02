import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials are not set. Set SUPABASE_URL and SUPABASE_ANON_KEY in your environment.');
}

export const supabase = createClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '');
export default supabase;
