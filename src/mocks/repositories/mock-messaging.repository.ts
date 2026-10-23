import type { MessagingRepository } from '@/domain/repositories/messaging.repository';
import type { Conversation, Message } from '@/domain/models/message';
import { getMockDb, delay } from '../mock-db';
import { NotFoundError } from '@/domain/errors/domain-error';

export class MockMessagingRepository implements MessagingRepository {
  async getConversations(): Promise<Conversation[]> {
    await delay();
    return getMockDb().conversations;
  }

  async getConversation(id: string): Promise<Conversation | null> {
    await delay(200);
    return getMockDb().conversations.find((c) => c.id === id) ?? null;
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    await delay();
    const db = getMockDb();
    return db.messages[conversationId] ?? [];
  }

  async sendMessage(conversationId: string, text: string): Promise<Message> {
    await delay(300);
    const db = getMockDb();
    const conversation = db.conversations.find((c) => c.id === conversationId);
    if (!conversation) throw new NotFoundError('Conversation', conversationId);

    const message: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: db.currentUser.id,
      text,
      createdAt: new Date().toISOString(),
      status: 'sent',
    };

    if (!db.messages[conversationId]) {
      db.messages[conversationId] = [];
    }
    db.messages[conversationId].push(message);

    conversation.lastMessage = text;
    conversation.lastMessageAt = message.createdAt;

    return message;
  }

  async markRead(conversationId: string): Promise<void> {
    await delay(100);
    const db = getMockDb();
    const conv = db.conversations.find((c) => c.id === conversationId);
    if (conv) {
      conv.unreadCount = 0;
      conv.hasUnreadMessages = false;
    }
  }

  async retryMessage(conversationId: string, messageId: string): Promise<Message> {
    await delay(300);
    const db = getMockDb();
    const msgs = db.messages[conversationId];
    if (!msgs) throw new NotFoundError('Conversation', conversationId);
    const msg = msgs.find((m) => m.id === messageId);
    if (!msg) throw new NotFoundError('Message', messageId);
    msg.status = 'sent';
    return msg;
  }
}
