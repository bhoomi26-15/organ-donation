import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';
import { auditService, auditLog } from './auditService';

type Donor = Database['public']['Tables']['donors']['Row'];
type DonorInsert = Database['public']['Tables']['donors']['Insert'];
type DonorUpdate = Database['public']['Tables']['donors']['Update'];

export const donorService = {
  /**
   * Get donor profile by user ID
   */
  async getDonorByUserId(userId: string): Promise<Donor | null> {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    return data || null;
  },

  /**
   * Get donor profile by ID
   */
  async getDonor(donorId: string): Promise<Donor | null> {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('id', donorId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create donor profile
   */
  async createDonor(donorData: DonorInsert) {
    const { data, error } = await supabase
      .from('donors')
      .insert(donorData)
      .select()
      .single();

    if (error) throw error;

    await auditService.log('CREATE_DONOR', `Donor profile created: ${donorData.full_name}`, data.id, 'donors');

    return data;
  },

  /**
   * Update donor profile
   */
  async updateDonor(donorId: string, updates: DonorUpdate) {
    const { data, error } = await supabase
      .from('donors')
      .update(updates)
      .eq('id', donorId)
      .select()
      .single();

    if (error) throw error;

    await auditService.log('UPDATE_DONOR', 'Donor profile updated', donorId, 'donors');

    return data;
  },

  /**
   * Get all donors
   */
  async getDonors(filters?: { hospital_id?: string; donor_status?: string; is_available?: boolean }) {
    let query = supabase.from('donors').select('*');

    if (filters?.hospital_id) {
      query = query.eq('hospital_id', filters.hospital_id);
    }
    if (filters?.donor_status) {
      query = query.eq('donor_status', filters.donor_status);
    }
    if (filters?.is_available !== undefined) {
      query = query.eq('is_available', filters.is_available);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  /**
   * Get verified and available donors
   */
  async getEligibleDonors(organType?: string) {
    let query = supabase
      .from('donors')
      .select('*')
      .eq('donor_status', 'verified')
      .eq('is_available', true);

    if (organType) {
      query = query.contains('organ_types', [organType]);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  /**
   * Verify donor
   */
  async verifyDonor(donorId: string) {
    const { data, error } = await supabase
      .from('donors')
      .update({ donor_status: 'verified' })
      .eq('id', donorId)
      .select()
      .single();

    if (error) throw error;

    await auditLog({
      actionType: 'VERIFY_DONOR',
      targetId: donorId,
      targetTable: 'donors',
      description: `Donor verified`,
    });

    return data;
  },

  /**
   * Set donor availability
   */
  async setDonorAvailability(donorId: string, isAvailable: boolean) {
    const { data, error } = await supabase
      .from('donors')
      .update({ is_available: isAvailable })
      .eq('id', donorId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
