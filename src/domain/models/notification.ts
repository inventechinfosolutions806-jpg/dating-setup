export type NotificationType =
  | 'introduction'
  | 'message'
  | 'activity'
  | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  actionUserId?: string;
  actionUserPhoto?: string;
}
