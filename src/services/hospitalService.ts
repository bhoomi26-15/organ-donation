import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';
import { auditLog } from './auditService';

type Hospital = Database['public']['Tables']['hospitals']['Row'];
type HospitalInsert = Database['public']['Tables']['hospitals']['Insert'];
type HospitalUpdate = Database['public']['Tables']['hospitals']['Update'];

export const hospitalService = {
  /**
   * Get hospital profile by user ID
   */
  async getHospitalByUserId(userId: string): Promise<Hospital | null> {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    return data || null;
  },

  /**
   * Get hospital by ID
   */
  async getHospital(hospitalId: string): Promise<Hospital | null> {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .eq('id', hospitalId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create hospital profile
   */
  async createHospital(hospitalData: HospitalInsert) {
    const { data, error } = await supabase
      .from('hospitals')
      .insert(hospitalData)
      .select()
      .single();

    if (error) throw error;

    await auditLog({
      actionType: 'CREATE_HOSPITAL',
      targetId: data.id,
      targetTable: 'hospitals',
      description: `Hospital profile created: ${hospitalData.hospital_name}`,
    });

    return data;
  },

  /**
   * Update hospital profile
   */
  async updateHospital(hospitalId: string, updates: HospitalUpdate) {
    const { data, error } = await supabase
      .from('hospitals')
      .update(updates)
      .eq('id', hospitalId)
      .select()
      .single();

    if (error) throw error;

    await auditLog({
      actionType: 'UPDATE_HOSPITAL',
      targetId: hospitalId,
      targetTable: 'hospitals',
      description: `Hospital profile updated`,
    });

    return data;
  },

  /**
   * Get all hospitals
   */
  async getHospitals(status?: string) {
    let query = supabase.from('hospitals').select('*');

    if (status) {
      query = query.eq('hospital_status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  /**
   * Get verified hospitals
   */
  async getVerifiedHospitals() {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .eq('hospital_status', 'verified');

    if (error) throw error;
    return data || [];
  },

  /**
   * Get pending hospitals for verification
   */
  async getPendingHospitals() {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .eq('hospital_status', 'pending');

    if (error) throw error;
    return data || [];
  },

  /**
   * Verify hospital
   */
  async verifyHospital(hospitalId: string) {
    const { data, error } = await supabase
      .from('hospitals')
      .update({ hospital_status: 'verified' })
      .eq('id', hospitalId)
      .select()
      .single();

    if (error) throw error;

    await auditLog({
      actionType: 'VERIFY_HOSPITAL',
      targetId: hospitalId,
      targetTable: 'hospitals',
      description: `Hospital verified`,
    });

    return data;
  },

  /**
   * Reject hospital
   */
  async rejectHospital(hospitalId: string) {
    const { data, error } = await supabase
      .from('hospitals')
      .update({ hospital_status: 'rejected' })
      .eq('id', hospitalId)
      .select()
      .single();

    if (error) throw error;

    await auditLog({
      actionType: 'REJECT_HOSPITAL',
      targetId: hospitalId,
      targetTable: 'hospitals',
      description: `Hospital rejected`,
    });

    return data;
  },
};
