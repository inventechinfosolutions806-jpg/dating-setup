export type MessageStatus = 'sending' | 'sent' | 'failed';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
  status: MessageStatus;
}

export interface Conversation {
  id: string;
  connectionId: string;
  participant: {
    id: string;
    displayName: string;
    photoUrl: string;
  };
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  hasUnreadMessages: boolean;
}
