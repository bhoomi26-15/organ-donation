import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

type Needer = Database['public']['Tables']['needers']['Row'];
type NeederInsert = Database['public']['Tables']['needers']['Insert'];

export const neederService = {
  async createNeeder(needer: NeederInsert) {
    const { data, error } = await supabase
      .from('needers')
      .insert(needer as any)
      .select()
      .single();

    if (error) throw error;
    return data as Needer;
  },

  async getNeeders() {
    const { data, error } = await supabase
      .from('needers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Needer[];
  },

  async getNeeder(id: string) {
    const { data, error } = await supabase
      .from('needers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Needer;
  },

  async updateNeeder(id: string, updates: any) {
    const { data, error } = await (supabase.from('needers') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Needer;
  },

  async getNeedersForOrgan(organ: string) {
    const { data, error } = await supabase
      .from('needers')
      .select('*')
      .eq('needed_organ', organ)
      .eq('needer_status', 'waiting');

    if (error) throw error;
    return (data || []) as Needer[];
  },

  async getNeedersForBloodGroup(bloodGroup: string) {
    const { data, error } = await supabase
      .from('needers')
      .select('*')
      .eq('blood_group', bloodGroup);

    if (error) throw error;
    return (data || []) as Needer[];
  },

  async assignDonorToNeeder(neederId: string, donorId: string) {
    const { data, error } = await (supabase.from('needers') as any)
      .update({
        matched_donor_id: donorId,
        needer_status: 'matched',
        updated_at: new Date().toISOString(),
      })
      .eq('id', neederId)
      .select()
      .single();

    if (error) throw error;
    return data as Needer;
  },
};
