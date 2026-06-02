// Frontend-only Supabase auth service (no Node.js dependencies)
import supabase from '../config/supabaseClient';

export async function signUp(email, password, role = 'individual') {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
        },
      },
    });
    if (error) return { error };
    return { data };
  } catch (error) {
    return { error };
  }
}

export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error };
    return { data };
  } catch (error) {
    return { error };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    return { error };
  }
}

export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) return { error };
    return { data: data.user };
  } catch (error) {
    return { error };
  }
}

export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) return { error };
    return { data: data.session };
  } catch (error) {
    return { error };
  }
}

export default {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  getSession,
};
