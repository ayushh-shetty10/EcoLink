import supabase from '../config/supabaseClient';

export async function getProfileById(id) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
  if (error) return { error };
  return { data };
}

export async function upsertProfile(profile) {
  // profile must include `id` (auth user id)
  const { data, error } = await supabase.from('profiles').upsert(profile).select().single();
  if (error) return { error };
  return { data };
}

export default { getProfileById, upsertProfile };
