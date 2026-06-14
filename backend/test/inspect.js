const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: { transport: ws },
});

async function inspectSchema() {
  try {
    console.log('Querying table schemas from postgres system catalog...');
    // We can run an arbitrary query via a simple SELECT or check the API.
    // Since we don't have direct SQL RPC defined, we can fetch one empty row to see columns,
    // or try querying a system table if RLS allows it (unlikely for anonymous keys on system tables).
    // Let's see if we can do postgrest requests or just check what fields are available on a select("*").
    const { data: prData, error: prError } = await supabase.from('pickup_requests').select('*').limit(0);
    if (prError) {
      console.error('Pickup requests fetch error:', prError);
    } else {
      console.log('pickup_requests fields:', prData);
    }

    const { data: instData, error: instError } = await supabase.from('institutions').select('*').limit(1);
    if (instError) {
      console.error('institutions fetch error:', instError);
    } else {
      console.log('institutions fields:', instData ? Object.keys(instData[0] || {}) : []);
    }
  } catch (e) {
    console.error('Error:', e);
  }
}

inspectSchema();
