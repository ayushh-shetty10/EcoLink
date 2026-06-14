const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: { transport: ws },
});

async function diagnose() {
  try {
    // Step 1: List all institutions
    console.log('\n==== ALL INSTITUTIONS ====');
    const { data: institutions, error: instErr } = await supabase
      .from('institutions')
      .select('id, name, is_active, is_available, created_at')
      .order('created_at', { ascending: true });

    if (instErr) {
      console.error('Error fetching institutions:', instErr);
      return;
    }
    institutions.forEach((inst, i) => {
      console.log(`  [${i + 1}] ID: ${inst.id} | Name: ${inst.name} | Active: ${inst.is_active} | Available: ${inst.is_available}`);
    });

    // Step 2: Simulate listAvailableInstitutions(1) — exactly what AddWasteScreen does
    console.log('\n==== SIMULATING listAvailableInstitutions(1) ====');
    console.log('This is the institution that ALL pickup requests get auto-assigned to:');
    const { data: firstInst, error: firstInstErr } = await supabase
      .from('institutions')
      .select('*')
      .eq('is_active', true)
      .eq('is_available', true)
      .order('created_at', { ascending: true })
      .limit(1);

    if (firstInstErr) {
      console.error('Error:', firstInstErr);
    } else {
      console.log(`  -> Auto-assigned to: "${firstInst[0]?.name}" (ID: ${firstInst[0]?.id})`);
    }
    const autoAssignedId = firstInst?.[0]?.id;

    // Step 3: List all pickup requests — using anon key (will be limited by RLS to own user's requests)
    console.log('\n==== ALL PICKUP REQUESTS (as anon) ====');
    const { data: requests, error: reqErr } = await supabase
      .from('pickup_requests')
      .select('id, user_id, institution_id, title, status, created_at')
      .order('created_at', { ascending: false });

    if (reqErr) {
      console.error('Error fetching requests:', reqErr);
    } else {
      console.log(`  Total requests visible (anon): ${requests.length}`);
      requests.forEach((req, i) => {
        const instMatch = institutions.find(inst => inst.id === req.institution_id);
        console.log(`  [${i + 1}] ID: ${req.id.substring(0, 8)}... | institution_id: ${req.institution_id} (${instMatch?.name || 'NOT FOUND'}) | status: ${req.status}`);
      });
    }

    // Step 4: Login as each institution and check how many requests they see
    console.log('\n==== RESULTS PER INSTITUTION (without auth) ====');
    for (const inst of institutions) {
      const { data: instRequests, error: irErr } = await supabase
        .from('pickup_requests')
        .select('id')
        .eq('institution_id', inst.id);

      if (irErr) {
        console.log(`  "${inst.name}": ERROR - ${irErr.message}`);
      } else {
        console.log(`  "${inst.name}" (${inst.id.substring(0, 8)}...): ${instRequests.length} requests assigned`);
      }
    }

    console.log('\n==== DIAGNOSIS CONCLUSION ====');
    if (autoAssignedId) {
      const autoInst = institutions.find(i => i.id === autoAssignedId);
      console.log(`  ⚠️  ALL new pickup requests are auto-assigned to: "${autoInst?.name}"`);
      console.log(`  ⚠️  Institution ID: ${autoAssignedId}`);
      console.log(`  ⚠️  Any institution user logging in with a DIFFERENT account will see 0 requests.`);
      console.log(`  ⚠️  Only the institution with the EARLIEST created_at gets all requests.`);
    }

  } catch (e) {
    console.error('Unexpected error:', e);
  }
}

diagnose();
