import supabase from '../config/supabaseClient';

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { error };
  return { data };
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error };
  return { data };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) return { error };
  return { data: data.user };
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) return { error };
  return { data: data.session };
}

export default {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  getSession,
};
