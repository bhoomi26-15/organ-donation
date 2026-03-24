import { supabase } from '../lib/supabase';

export const auditLog = async (
  actorUid: string,
  actorRole: string,
  actionType: string,
  targetId: string | null = null,
  targetTable: string | null = null,
  description: string | null = null
) => {
  try {
    await supabase.from('audit_logs').insert({
      actor_uid: actorUid,
      actor_role: actorRole,
      action_type: actionType,
      target_id: targetId,
      target_table: targetTable,
      description: description,
    });
  } catch (error) {
    console.error('Audit log failed:', error);
  }
};
