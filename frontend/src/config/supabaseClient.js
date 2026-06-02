import { createClient } from '@supabase/supabase-js';
import SUPABASE_CONFIG from './supabaseConfig';

const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

export default supabase;
