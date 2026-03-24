import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';
import { auditLog } from './auditService';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export const profileService = {
  /**
   * Get user profile by ID
   */
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    return data || null;
  },

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: ProfileUpdate) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    if (updates.role) {
      await auditLog({
        actionType: 'UPDATE_ROLE',
        targetId: userId,
        targetTable: 'profiles',
        description: `User role updated to ${updates.role}`,
      });
    }

    return data;
  },

  /**
   * Create profile (usually called from DB trigger on signup)
   */
  async createProfile(
    userId: string,
    fullName: string,
    email: string,
    role: 'donor' | 'recipient' | 'hospital' | 'admin'
  ) {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        full_name: fullName,
        email,
        role,
        profile_completed: false,
        account_status: 'active',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Mark profile as completed
   */
  async markProfileCompleted(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ profile_completed: true })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get all profiles with optional filter
   */
  async getProfiles(role?: string) {
    let query = supabase.from('profiles').select('*');

    if (role) {
      query = query.eq('role', role);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
};
