import supabase from '../config/supabaseClient';

// Subscribe to auth state changes. callback receives (event, session)
export function onAuthStateChange(callback) {
  const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });

  return () => listener.subscription.unsubscribe();
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session || null;
}

export default { onAuthStateChange, getSession };
