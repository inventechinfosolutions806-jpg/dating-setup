import type { NotificationRepository } from '@/domain/repositories/notification.repository';
import type { AppNotification } from '@/domain/models/notification';
import { supabase } from '@/lib/supabase';

export class SupabaseNotificationRepository implements NotificationRepository {
  async getNotifications(): Promise<AppNotification[]> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    if (!data) return [];

    return data.map((n) => ({
      id: n.id,
      type: n.type as AppNotification['type'],
      title: n.title,
      body: n.body,
      createdAt: n.created_at,
      read: n.read,
      actionUserId: n.action_user_id ?? undefined,
      actionUserPhoto: n.action_user_photo ?? undefined,
    }));
  }

  async markRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (error) throw new Error(error.message);
  }

  async markAllRead(): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', session.user.id)
      .eq('read', false);

    if (error) throw new Error(error.message);
  }
}
