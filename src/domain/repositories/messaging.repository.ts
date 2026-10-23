import type { Conversation, Message } from '@/domain/models/message';

export interface MessagingRepository {
  getConversations(): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | null>;
  getMessages(conversationId: string): Promise<Message[]>;
  sendMessage(conversationId: string, text: string): Promise<Message>;
  markRead(conversationId: string): Promise<void>;
  retryMessage(conversationId: string, messageId: string): Promise<Message>;
}
