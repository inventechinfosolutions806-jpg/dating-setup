import { repositories } from '@/app/composition/repositories';

export const messagingService = {
  getConversations: () => repositories.messaging.getConversations(),
  getConversation: (id: string) => repositories.messaging.getConversation(id),
  getMessages: (conversationId: string) => repositories.messaging.getMessages(conversationId),
  sendMessage: (conversationId: string, text: string) => repositories.messaging.sendMessage(conversationId, text),
  markRead: (conversationId: string) => repositories.messaging.markRead(conversationId),
  retryMessage: (conversationId: string, messageId: string) => repositories.messaging.retryMessage(conversationId, messageId),
};
