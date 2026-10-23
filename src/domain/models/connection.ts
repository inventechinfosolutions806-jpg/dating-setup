export type ConnectionStatus =
  | 'active'
  | 'pending'
  | 'archived'
  | 'ended';

export interface Connection {
  id: string;
  userId: string;
  displayName: string;
  age: number;
  photoUrl: string;
  city: string;
  status: ConnectionStatus;
  connectedAt: string;
  lastActivity: string;
  sharedInterests: string[];
  hasUnreadMessages: boolean;
  unreadCount: number;
}
