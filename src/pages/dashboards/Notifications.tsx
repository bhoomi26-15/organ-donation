import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Bell, Check, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { markAsRead, markAllAsRead } from '../../services/notificationService';

export function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkRead = async (id: string) => {
    await markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const handleMarkAll = async () => {
    if (!user) return;
    await markAllAsRead(user.id);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const IconForType = ({ type }: { type: string }) => {
    switch (type) {
      case 'success': return <div className="p-2 bg-green-50 text-green-600 rounded-full"><CheckCircle className="w-5 h-5"/></div>;
      case 'warning': return <div className="p-2 bg-yellow-50 text-yellow-600 rounded-full"><AlertTriangle className="w-5 h-5"/></div>;
      case 'error': return <div className="p-2 bg-red-50 text-red-600 rounded-full"><AlertTriangle className="w-5 h-5"/></div>;
      default: return <div className="p-2 bg-blue-50 text-blue-600 rounded-full"><Info className="w-5 h-5"/></div>;
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500">Updates regarding matches, status changes, and system alerts.</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAll}>
            <Check className="w-4 h-4 mr-2" /> Mark all read
          </Button>
        )}
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <div className="flex justify-between items-center">
             <div>
               <CardTitle>Recent Alerts {unreadCount > 0 && <span className="ml-2 bg-primary-100 text-primary-700 text-xs py-1 px-2 rounded-full font-bold">{unreadCount} New</span>}</CardTitle>
               <CardDescription>Stay updated on the process.</CardDescription>
             </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="py-8 text-center">Loading...</div>
          ) : notifications.length === 0 ? (
             <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
               <Bell className="mx-auto h-12 w-12 text-slate-300 mb-3" />
               <p className="text-slate-500 font-medium">You're all caught up!</p>
               <p className="text-sm text-slate-400 mt-1">Check back later for new alerts.</p>
             </div>
          ) : (
             <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg">
               {notifications.map(n => (
                 <div key={n.id} className={`p-4 flex gap-4 transition-colors ${n.is_read ? 'bg-white opacity-70' : 'bg-slate-50'}`}>
                   <div className="shrink-0 mt-1"><IconForType type={n.type || 'info'} /></div>
                   <div className="flex-1 min-w-0">
                     <p className={`text-sm font-semibold ${n.is_read ? 'text-slate-700' : 'text-slate-900'}`}>{n.title}</p>
                     <p className="text-sm text-slate-600 mt-1">{n.message}</p>
                     <p className="text-xs text-slate-400 mt-2 font-medium">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</p>
                   </div>
                   {!n.is_read && (
                     <div className="shrink-0">
                       <button onClick={() => handleMarkRead(n.id)} className="text-xs text-primary-600 hover:text-primary-700 font-semibold p-2 hover:bg-primary-50 rounded transition-colors">Mark read</button>
                     </div>
                   )}
                 </div>
               ))}
             </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
