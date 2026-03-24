import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

type Donor = Database['public']['Tables']['donors']['Row'];
type DonorInsert = Database['public']['Tables']['donors']['Insert'];

export const donorService = {
  async createDonor(donor: DonorInsert) {
    const { data, error } = await supabase
      .from('donors')
      .insert(donor as any)
      .select()
      .single();

    if (error) throw error;
    return data as Donor;
  },

  async getDonors() {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Donor[];
  },

  async getDonor(id: string) {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Donor;
  },

  async updateDonor(id: string, updates: any) {
    const { data, error } = await (supabase.from('donors') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Donor;
  },

  async getDonorsByOrgan(organType: string) {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('organ_type', organType)
      .eq('donor_status', 'available');

    if (error) throw error;
    return (data || []) as Donor[];
  },

  async getDonorsByBloodGroup(bloodGroup: string) {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('blood_group', bloodGroup);

    if (error) throw error;
    return (data || []) as Donor[];
  },

  async getDonorsByCity(city: string) {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('city', city);

    if (error) throw error;
    return (data || []) as Donor[];
  },
};
