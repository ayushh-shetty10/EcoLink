import supabase from '../config/supabaseClient';

export async function getInstitutionById(id) {
  try {
    const { data, error } = await supabase.from('institutions').select('*').eq('id', id).maybeSingle();
    if (error) return { error };
    return { data };
  } catch (error) {
    return { error };
  }
}

export async function setInstitutionActiveStatus(id, is_active) {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user?.id) {
      return { error: authError || { message: 'User session not found' } };
    }

    const targetId = id || authData.user.id;
    const { data, error } = await supabase
      .from('institutions')
      .update({ is_active })
      .eq('id', targetId)
      .select()
      .single();
    if (error) return { error };
    return { data };
  } catch (error) {
    return { error };
  }
}

export async function upsertInstitution(payload) {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user?.id) {
      return { error: authError || { message: 'User session not found' } };
    }

    const safePayload = {
      ...payload,
      id: authData.user.id,
    };

    const { data, error } = await supabase.from('institutions').upsert(safePayload).select().single();
    if (error) return { error };
    return { data };
  } catch (error) {
    return { error };
  }
}

export async function listAvailableInstitutions(limit = 20) {
  try {
    const { data, error } = await supabase
      .from('institutions')
      .select('*')
      .eq('is_active', true)
      .eq('is_available', true)
      .order('created_at', { ascending: true })
      .limit(limit);
    if (error) return { error };
    return { data: data || [] };
  } catch (error) {
    return { error, data: [] };
  }
}

export async function setInstitutionAvailability(id, is_available) {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user?.id) {
      return { error: authError || { message: 'User session not found' } };
    }

    const targetId = id || authData.user.id;
    const { data, error } = await supabase
      .from('institutions')
      .update({ is_available })
      .eq('id', targetId)
      .select()
      .single();
    if (error) return { error };
    return { data };
  } catch (error) {
    return { error };
  }
}

export default {
  getInstitutionById,
  upsertInstitution,
  listAvailableInstitutions,
  setInstitutionAvailability,
  setInstitutionActiveStatus,
};
