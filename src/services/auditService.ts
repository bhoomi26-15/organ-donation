import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

type AuditLog = Database['public']['Tables']['audit_logs']['Row'];

export const auditService = {
  /**
   * Create audit log entry
   */
  async log(
    actionType: string,
    description: string,
    targetId?: string | null,
    targetTable?: string | null,
    actorUid?: string | null,
    actorRole?: string | null
  ) {
    const { error } = await supabase.from('audit_logs').insert({
      actor_uid: actorUid || null,
      actor_role: actorRole || null,
      action_type: actionType,
      target_id: targetId || null,
      target_table: targetTable || null,
      description,
    });

    if (error) {
      console.error('Audit log failed:', error);
    }
  },

  /**
   * Get audit logs
   */
  async getLogs(filters?: { action_type?: string; target_table?: string; limit?: number }) {
    let query = supabase.from('audit_logs').select('*');

    if (filters?.action_type) {
      query = query.eq('action_type', filters.action_type);
    }
    if (filters?.target_table) {
      query = query.eq('target_table', filters.target_table);
    }

    const limit = filters?.limit || 100;
    const { data, error } = await query.order('created_at', { ascending: false }).limit(limit);

    if (error) throw error;
    return data || [];
  },

  /**
   * Get logs for a specific target
   */
  async getLogsForTarget(targetId: string, targetTable?: string) {
    let query = supabase.from('audit_logs').select('*').eq('target_id', targetId);

    if (targetTable) {
      query = query.eq('target_table', targetTable);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  /**
   * Get logs by actor
   */
  async getLogsByActor(actorUid: string) {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('actor_uid', actorUid)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data || [];
  },
};

/**
 * Legacy function for backward compatibility
 */
export const auditLog = async (
  actorUidOrObject: string | any,
  actorRole?: string,
  actionType?: string,
  targetId?: string | null,
  targetTable?: string | null,
  description?: string | null
) => {
  // Handle new object-based API
  if (typeof actorUidOrObject === 'object') {
    const { actionType, description, targetId, targetTable, actorUid, actorRole } = actorUidOrObject;
    return auditService.log(actionType, description, targetId, targetTable, actorUid, actorRole);
  }

  // Handle legacy positional arguments
  return auditService.log(
    actionType || '',
    description || '',
    targetId,
    targetTable,
    actorUidOrObject,
    actorRole
  );
};
