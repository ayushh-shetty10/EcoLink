const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: { transport: ws },
});

// Exact implementation from imageService.js
function base64ToUint8Array(base64) {
  console.log('[base64ToUint8Array] Starting base64 conversion...');
  const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;

  if (typeof Buffer !== 'undefined') {
    console.log('[base64ToUint8Array] Using Buffer implementation');
    return Uint8Array.from(Buffer.from(cleanBase64, 'base64'));
  }

  console.log('[base64ToUint8Array] Buffer not found, using pure JS base64 decoder');
  try {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const lookup = new Uint8Array(256);
    for (let i = 0; i < chars.length; i++) {
      lookup[chars.charCodeAt(i)] = i;
    }

    let bufferLength = cleanBase64.length * 0.75;
    if (cleanBase64[cleanBase64.length - 1] === '=') {
      bufferLength--;
      if (cleanBase64[cleanBase64.length - 2] === '=') {
        bufferLength--;
      }
    }

    const bytes = new Uint8Array(bufferLength);
    let p = 0;
    for (let i = 0; i < cleanBase64.length; i += 4) {
      const base64code1 = lookup[cleanBase64.charCodeAt(i)];
      const base64code2 = lookup[cleanBase64.charCodeAt(i + 1)];
      const base64code3 = lookup[cleanBase64.charCodeAt(i + 2)];
      const base64code4 = lookup[cleanBase64.charCodeAt(i + 3)];

      bytes[p++] = (base64code1 << 2) | (base64code2 >> 4);
      if (p < bufferLength) {
        bytes[p++] = ((base64code2 & 15) << 4) | (base64code3 >> 2);
      }
      if (p < bufferLength) {
        bytes[p++] = ((base64code3 & 3) << 6) | (base64code4 & 63);
      }
    }
    console.log(`[base64ToUint8Array] Decoded successfully. Output length: ${bytes.length} bytes.`);
    return bytes;
  } catch (err) {
    console.error('[base64ToUint8Array] Pure JS base64 decoder failed:', err);
    throw err;
  }
}

async function simulate() {
  const email = `testuser_${Date.now()}@example.com`;
  const password = 'Password123!';

  try {
    console.log('1. Signing up a test individual user...');
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'individual',
        }
      }
    });

    if (signUpError) {
      console.error('Signup failed:', signUpError);
      return;
    }

    const user = authData.user;
    console.log('User signed up successfully. ID:', user.id);

    console.log('2. Upserting profile row for the user...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email,
        role: 'individual',
        full_name: 'Test User',
        phone: '+1234567890',
        address: '123 Test St',
        profile_completed: true,
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile upsert failed:', profileError);
      return;
    }
    console.log('Profile upserted successfully:', profile);

    // Let's sign in explicitly to establish the session in the client
    console.log('3. Signing in to establish authenticated session...');
    const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error('Sign in failed:', signInError);
      return;
    }
    console.log('Signed in successfully.');

    console.log('4. Listing available institutions...');
    const { data: institutions, error: instError } = await supabase
      .from('institutions')
      .select('*')
      .eq('is_active', true)
      .eq('is_available', true)
      .order('created_at', { ascending: true })
      .limit(1);

    if (instError) {
      console.error('Listing institutions failed:', instError);
      return;
    }
    console.log('Available institutions:', institutions);
    const assignedInst = institutions[0];

    console.log('5. Testing base64 conversion...');
    const dummyBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='; // 1x1 png
    
    // Test base64ToUint8Array (force simulated RN environment by hiding Buffer)
    const originalBuffer = global.Buffer;
    delete global.Buffer;
    
    const bytes = base64ToUint8Array(dummyBase64);
    
    // Restore Buffer
    global.Buffer = originalBuffer;

    console.log('Decoded bytes size:', bytes.length);

    console.log('6. Uploading image to storage...');
    const fileName = `${user.id}-${Date.now()}-test.png`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('ewaste-images')
      .upload(fileName, bytes, {
        contentType: 'image/png',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload failed:', uploadError);
      return;
    }
    const { data: publicData } = supabase.storage.from('ewaste-images').getPublicUrl(fileName);
    const imageUrl = publicData.publicUrl;
    console.log('Upload success. Public URL:', imageUrl);

    console.log('7. Attempting to insert pickup request...');
    const payload = {
      user_id: user.id,
      institution_id: assignedInst ? assignedInst.id : null,
      title: 'Simulated Laptop Recycle',
      category: 'Laptop',
      condition: 'non-working',
      image_url: imageUrl,
      status: 'pending',
    };
    console.log('Payload:', payload);

    const { data: request, error: reqError } = await supabase
      .from('pickup_requests')
      .insert(payload)
      .select()
      .single();

    if (reqError) {
      console.error('Pickup request creation failed:', reqError);
    } else {
      console.log('Pickup request created successfully:', request);
    }

  } catch (err) {
    console.error('Unexpected simulator error:', err);
  }
}

simulate();
