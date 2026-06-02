import supabase from '../config/supabaseClient';

export async function createPickupRequest(payload) {
  try {
    const { data, error } = await supabase.from('pickup_requests').insert(payload).select().single();
    if (error) return { error };
    return { data };
  } catch (error) {
    return { error };
  }
}

export async function listPickupRequestsByInstitution(institution_id, status) {
  let query = supabase
    .from('pickup_requests')
    .select('*')
    .eq('institution_id', institution_id)
    .order('created_at', { ascending: false });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  try {
    const { data, error } = await query;
    if (error) return { error };
    return { data: data || [] };
  } catch (error) {
    return { error, data: [] };
  }
}

export async function listPickupRequestsByUser(user_id) {
  try {
    const { data, error } = await supabase
      .from('pickup_requests')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });
    if (error) return { error };
    return { data: data || [] };
  } catch (error) {
    return { error, data: [] };
  }
}

export async function getPickupRequestById(id) {
  try {
    const { data, error } = await supabase.from('pickup_requests').select('*').eq('id', id).maybeSingle();
    if (error) return { error };
    return { data };
  } catch (error) {
    return { error };
  }
}

export async function updatePickupRequestStatus(id, status) {
  try {
    const { data, error } = await supabase
      .from('pickup_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) return { error };
    return { data };
  } catch (error) {
    return { error };
  }
}

export default {
  createPickupRequest,
  listPickupRequestsByInstitution,
  listPickupRequestsByUser,
  getPickupRequestById,
  updatePickupRequestStatus,
};
