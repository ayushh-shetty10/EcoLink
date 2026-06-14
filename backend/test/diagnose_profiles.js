const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: { transport: ws },
});

async function runDiagnostics() {
  try {
    console.log('--- Fetching all pickup requests (bypass RLS by printing what exists or querying directly) ---');
    const { data: requests, error: reqErr } = await supabase.from('pickup_requests').select('*');
    if (reqErr) {
      console.error('Error fetching pickup requests:', reqErr);
      return;
    }
    console.log(`Found ${requests.length} total pickup requests.`);

    const userIds = [...new Set(requests.map(r => r.user_id))];
    console.log('Unique user IDs in requests:', userIds);

    for (const userId of userIds) {
      console.log(`\nQuerying profile for User ID: ${userId}...`);
      const { data: profile, error: profErr } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (profErr) {
        console.error(`Error for ${userId}:`, profErr);
      } else {
        console.log(`Profile for ${userId}:`, profile);
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

runDiagnostics();
