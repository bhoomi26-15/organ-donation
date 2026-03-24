import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';
import { auditLog } from './auditService';

type Request = Database['public']['Tables']['requests']['Row'];
type RequestInsert = Database['public']['Tables']['requests']['Insert'];
type RequestUpdate = Database['public']['Tables']['requests']['Update'];

export const requestService = {
  /**
   * Get request by ID
   */
  async getRequest(requestId: string): Promise<Request | null> {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get requests for a recipient
   */
  async getRequestsByRecipient(recipientId: string) {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('recipient_id', recipientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Create organ request
   */
  async createRequest(requestData: RequestInsert) {
    const { data, error } = await supabase
      .from('requests')
      .insert(requestData)
      .select()
      .single();

    if (error) throw error;

    await auditLog({
      actionType: 'CREATE_REQUEST',
      targetId: data.id,
      targetTable: 'requests',
      description: `Organ request created for ${requestData.required_organ}`,
    });

    return data;
  },

  /**
   * Update request
   */
  async updateRequest(requestId: string, updates: RequestUpdate) {
    const { data, error } = await supabase
      .from('requests')
      .update(updates)
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;

    await auditLog({
      actionType: 'UPDATE_REQUEST',
      targetId: requestId,
      targetTable: 'requests',
      description: `Request updated`,
    });

    return data;
  },

  /**
   * Get all requests
   */
  async getRequests(filters?: { hospital_id?: string; status?: string }) {
    let query = supabase.from('requests').select('*');

    if (filters?.hospital_id) {
      query = query.eq('hospital_id', filters.hospital_id);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  /**
   * Get pending requests
   */
  async getPendingRequests() {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Approve request
   */
  async approveRequest(requestId: string, approvedBy: string) {
    const { data, error } = await supabase
      .from('requests')
      .update({
        status: 'approved',
        approved_by: approvedBy,
        approved_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;

    await auditLog({
      actionType: 'APPROVE_REQUEST',
      targetId: requestId,
      targetTable: 'requests',
      description: `Request approved`,
    });

    return data;
  },

  /**
   * Reject request
   */
  async rejectRequest(requestId: string) {
    const { data, error } = await supabase
      .from('requests')
      .update({ status: 'rejected' })
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;

    await auditLog({
      actionType: 'REJECT_REQUEST',
      targetId: requestId,
      targetTable: 'requests',
      description: `Request rejected`,
    });

    return data;
  },

  /**
   * Get requests needing approval
   */
  async getRequestsNeedingApproval(hospitalId?: string) {
    let query = supabase
      .from('requests')
      .select('*')
      .eq('status', 'pending');

    if (hospitalId) {
      query = query.eq('hospital_id', hospitalId);
    }

    const { data, error } = await query.order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },
};
