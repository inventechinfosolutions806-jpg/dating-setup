import type { NotificationRepository } from '@/domain/repositories/notification.repository';
import type { AppNotification } from '@/domain/models/notification';
import { getMockDb, delay } from '../mock-db';
import { NotFoundError } from '@/domain/errors/domain-error';

export class MockNotificationRepository implements NotificationRepository {
  async getNotifications(): Promise<AppNotification[]> {
    await delay();
    return getMockDb().notifications;
  }

  async markRead(id: string): Promise<void> {
    await delay(150);
    const db = getMockDb();
    const notif = db.notifications.find((n) => n.id === id);
    if (!notif) throw new NotFoundError('Notification', id);
    notif.read = true;
  }

  async markAllRead(): Promise<void> {
    await delay(200);
    getMockDb().notifications.forEach((n) => (n.read = true));
  }
}
