import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';
import { auditService, auditLog } from './auditService';

type Recipient = Database['public']['Tables']['recipients']['Row'];
type RecipientInsert = Database['public']['Tables']['recipients']['Insert'];
type RecipientUpdate = Database['public']['Tables']['recipients']['Update'];

export const recipientService = {
  /**
   * Get recipient profile by user ID
   */
  async getRecipientByUserId(userId: string): Promise<Recipient | null> {
    const { data, error } = await supabase
      .from('recipients')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    return data || null;
  },

  /**
   * Get recipient by ID
   */
  async getRecipient(recipientId: string): Promise<Recipient | null> {
    const { data, error } = await supabase
      .from('recipients')
      .select('*')
      .eq('id', recipientId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create recipient profile
   */
  async createRecipient(recipientData: RecipientInsert) {
    const { data, error } = await supabase
      .from('recipients')
      .insert(recipientData)
      .select()
      .single();

    if (error) throw error;

    await auditService.log('CREATE_RECIPIENT', `Recipient profile created: ${recipientData.full_name}`, data.id, 'recipients');

    return data;
  },

  /**
   * Update recipient profile
   */
  async updateRecipient(recipientId: string, updates: RecipientUpdate) {
    const { data, error } = await supabase
      .from('recipients')
      .update(updates)
      .eq('id', recipientId)
      .select()
      .single();

    if (error) throw error;

    await auditService.log('UPDATE_RECIPIENT', 'Recipient profile updated', recipientId, 'recipients');

    return data;
  },

  /**
   * Get all recipients
   */
  async getRecipients(filters?: { hospital_id?: string; status?: string }) {
    let query = supabase.from('recipients').select('*');

    if (filters?.hospital_id) {
      query = query.eq('hospital_id', filters.hospital_id);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  /**
   * Get recipients needing approval
   */
  async getPendingRecipients() {
    const { data, error } = await supabase
      .from('recipients')
      .select('*')
      .eq('status', 'pending');

    if (error) throw error;
    return data || [];
  },

  /**
   * Approve recipient
   */
  async approveRecipient(recipientId: string) {
    const { data, error } = await supabase
      .from('recipients')
      .update({ status: 'approved' })
      .eq('id', recipientId)
      .select()
      .single();

    if (error) throw error;

    await auditLog({
      actionType: 'APPROVE_RECIPIENT',
      targetId: recipientId,
      targetTable: 'recipients',
      description: `Recipient approved`,
    });

    return data;
  },

  /**
   * Reject recipient
   */
  async rejectRecipient(recipientId: string) {
    const { data, error } = await supabase
      .from('recipients')
      .update({ status: 'rejected' })
      .eq('id', recipientId)
      .select()
      .single();

    if (error) throw error;

    await auditLog({
      actionType: 'REJECT_RECIPIENT',
      targetId: recipientId,
      targetTable: 'recipients',
      description: `Recipient rejected`,
    });

    return data;
  },
};
