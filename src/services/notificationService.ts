import { supabase } from '../lib/supabase';

export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
) => {
  const { error } = await supabase.from('notifications').insert({
    user_id: userId,
    title,
    message,
    type,
    is_read: false
  });
  if (error) console.error('Error creating notification:', error);
};

export const markAsRead = async (notificationId: string) => {
  const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId);
  if (error) throw error;
};

export const markAllAsRead = async (userId: string) => {
  const { error } = await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId);
  if (error) throw error;
};
