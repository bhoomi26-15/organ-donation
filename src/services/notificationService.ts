import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

type Notification = Database['public']['Tables']['notifications']['Row'];

export const notificationService = {
  /**
   * Get notifications for a user
   */
  async getNotifications(userId: string, unreadOnly = false) {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId);

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<number> {
    const { data, error, count } = await supabase
      .from('notifications')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  },

  /**
   * Create notification
   */
  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: string
  ) {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        is_read: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
  },

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  },

  /**
   * Notify user about match
   */
  async notifyMatchFound(userId: string, donorName: string, organType: string) {
    return this.createNotification(
      userId,
      'Match Found!',
      `A potential match has been found for ${organType}. Donor: ${donorName}`,
      'MATCH'
    );
  },

  /**
   * Notify about request status
   */
  async notifyRequestStatus(userId: string, status: string, organType: string) {
    return this.createNotification(
      userId,
      `Request ${status}`,
      `Your organ request for ${organType} has been ${status.toLowerCase()}`,
      'REQUEST'
    );
  },
};

// Legacy exports for backward compatibility
export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
) => {
  return notificationService.createNotification(userId, title, message, type);
};

export const markAsRead = async (notificationId: string) => {
  return notificationService.markAsRead(notificationId);
};

export const markAllAsRead = async (userId: string) => {
  return notificationService.markAllAsRead(userId);
};
