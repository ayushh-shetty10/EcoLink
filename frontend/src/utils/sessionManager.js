// Frontend-only session manager
import supabase from '../config/supabaseClient';

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
