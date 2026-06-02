const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.example') });

const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in backend/.env.example');
  process.exit(2);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: { transport: ws },
});

async function test() {
  try {
    console.log('Connecting to Supabase...');
    // Try a lightweight RPC: list first profile or ping via simple select
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    if (error) {
      console.error('Query error:', error.message || error);
      process.exitCode = 1;
      return;
    }
    console.log('Connected. Sample result:', data);
  } catch (e) {
    console.error('Unexpected error:', e.message || e);
    process.exitCode = 1;
  }
}

test();
