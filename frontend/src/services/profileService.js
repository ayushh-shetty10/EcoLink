// Frontend-only profile service
import supabase from '../config/supabaseClient';

export async function getProfileById(id) {
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
    if (error) return { error };
    return { data };
  } catch (error) {
    return { error };
  }
}

export async function upsertProfile(profile) {
  try {
    const { data, error } = await supabase.from('profiles').upsert(profile).select().single();
    if (error) return { error };
    return { data };
  } catch (error) {
    return { error };
  }
}

export async function createProfileForUser({ id, email, role = 'individual', full_name = null }) {
  const safeName = full_name || email?.split('@')[0] || 'EcoLink User';
  const payload = {
    id,
    email,
    full_name: safeName,
    role,
  };
  try {
    const { data, error } = await supabase.from('profiles').upsert(payload).select().single();
    if (error) return { error };
    return { data };
  } catch (error) {
    return { error };
  }
}

export async function updateProfileRole(id, role) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', id)
      .select()
      .single();
    if (error) return { error };
    return { data };
  } catch (error) {
    return { error };
  }
}

export default { getProfileById, upsertProfile, createProfileForUser, updateProfileRole };
