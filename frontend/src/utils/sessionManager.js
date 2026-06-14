// Frontend-only session manager
import supabase from '../config/supabaseClient';

export function onAuthStateChange(callback) {
  const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });

  return () => listener.subscription.unsubscribe();
}

export async function getSession() {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session || null;
  } catch (error) {
    console.warn('Unable to restore Supabase session at startup.', error);
    return null;
  }
}

export default { onAuthStateChange, getSession };
