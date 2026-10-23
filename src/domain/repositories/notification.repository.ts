import type { AppNotification } from '@/domain/models/notification';

export interface NotificationRepository {
  getNotifications(): Promise<AppNotification[]>;
  markRead(id: string): Promise<void>;
  markAllRead(): Promise<void>;
}
