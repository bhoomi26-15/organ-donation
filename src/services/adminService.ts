import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

type Admin = Database['public']['Tables']['admins']['Row'];
type AdminInsert = Database['public']['Tables']['admins']['Insert'];

export const adminService = {
  async getAllAdmins() {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Admin[];
  },

  async getAdminByEmail(email: string) {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    return data as Admin | null;
  },

  async getAdmin(id: string) {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Admin;
  },

  async createAdmin(admin: AdminInsert) {
    const { data, error } = await supabase
      .from('admins')
      .insert(admin as any)
      .select()
      .single();

    if (error) throw error;
    return data as Admin;
  },

  async validateAdminLogin(email: string) {
    const admin = await this.getAdminByEmail(email);
    return admin !== null;
  },
};
