const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Create client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: { transport: ws },
});

async function runTest() {
  const timestamp = Date.now();
  const instEmail = `test_inst_${timestamp}@example.com`;
  const userEmail = `test_user_${timestamp}@example.com`;
  const password = 'Password123!';

  try {
    console.log('1. Signing up test institution auth user...');
    const { data: instAuth, error: instAuthErr } = await supabase.auth.signUp({
      email: instEmail,
      password,
      options: { data: { role: 'institution' } }
    });
    if (instAuthErr) throw instAuthErr;
    const instId = instAuth.user.id;
    console.log('Institution Auth User created. ID:', instId);

    console.log('2. Creating profile and institution rows for the institution...');
    // Profiles trigger creates a profile automatically, let's upsert it to make sure role is correct
    const { error: instProfErr } = await supabase.from('profiles').upsert({
      id: instId,
      email: instEmail,
      role: 'institution',
      full_name: 'Test Inst Profile',
      profile_completed: true
    });
    if (instProfErr) throw instProfErr;

    const { error: instRowErr } = await supabase.from('institutions').insert({
      id: instId,
      name: 'Test Institution',
      type: 'NGO',
      address: 'Test Address',
      phone: '+1234567890',
      description: 'Test Description',
      is_active: true,
      is_available: true
    });
    if (instRowErr) throw instRowErr;
    console.log('Institution row inserted.');

    console.log('3. Signing up test individual user...');
    const { data: userAuth, error: userAuthErr } = await supabase.auth.signUp({
      email: userEmail,
      password,
      options: { data: { role: 'individual' } }
    });
    if (userAuthErr) throw userAuthErr;
    const userId = userAuth.user.id;
    console.log('Individual Auth User created. ID:', userId);

    console.log('4. Creating profile for the individual user...');
    const { error: userProfErr } = await supabase.from('profiles').upsert({
      id: userId,
      email: userEmail,
      role: 'individual',
      full_name: 'Test Individual',
      profile_completed: true
    });
    if (userProfErr) throw userProfErr;

    console.log('5. Logging in as individual user to create pickup request...');
    const { error: loginUserErr } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password
    });
    if (loginUserErr) throw loginUserErr;

    console.log('6. Inserting pickup request assigned to the institution...');
    const { data: reqData, error: reqErr } = await supabase.from('pickup_requests').insert({
      user_id: userId,
      institution_id: instId,
      title: 'Test Laptop',
      category: 'Laptop',
      condition: 'non-working',
      image_url: 'https://example.com/image.jpg',
      status: 'pending'
    }).select().single();
    if (reqErr) throw reqErr;
    console.log('Pickup request created:', reqData);

    console.log('7. Logging in as the institution user...');
    const { error: loginInstErr } = await supabase.auth.signInWithPassword({
      email: instEmail,
      password
    });
    if (loginInstErr) throw loginInstErr;

    console.log('8. Querying pickup requests as the logged-in institution...');
    const { data: queriedReqs, error: queryErr } = await supabase
      .from('pickup_requests')
      .select('*')
      .eq('institution_id', instId);

    if (queryErr) {
      console.error('Query failed:', queryErr);
    } else {
      console.log('Query succeeded. Requests returned:', queriedReqs);
    }

  } catch (err) {
    console.error('Test failed with error:', err);
  }
}

runTest();
