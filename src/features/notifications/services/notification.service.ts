import { repositories } from '@/app/composition/repositories';

export const notificationService = {
  getNotifications: () => repositories.notification.getNotifications(),
  markRead: (id: string) => repositories.notification.markRead(id),
  markAllRead: () => repositories.notification.markAllRead(),
};
