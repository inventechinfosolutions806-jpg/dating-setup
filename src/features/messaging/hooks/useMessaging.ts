import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagingService } from '../services/messaging.service';

export const messagingKeys = {
  all: ['messaging'] as const,
  conversations: () => [...messagingKeys.all, 'conversations'] as const,
  messages: (conversationId: string) => [...messagingKeys.all, 'messages', conversationId] as const,
};

export function useConversations() {
  return useQuery({
    queryKey: messagingKeys.conversations(),
    queryFn: messagingService.getConversations,
  });
}

export function useMessages(conversationId: string | undefined) {
  return useQuery({
    queryKey: messagingKeys.messages(conversationId ?? ''),
    queryFn: () => messagingService.getMessages(conversationId ?? ''),
    enabled: !!conversationId,
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, text }: { conversationId: string; text: string }) =>
      messagingService.sendMessage(conversationId, text),
    onMutate: async ({ conversationId, text }) => {
      const queryKey = messagingKeys.messages(conversationId);
      await qc.cancelQueries({ queryKey });
      const prev = qc.getQueryData<import('@/domain/models/message').Message[]>(queryKey);
      if (prev) {
        const optimistic: import('@/domain/models/message').Message = {
          id: `temp-${Date.now()}`,
          conversationId,
          senderId: 'user-001',
          text,
          createdAt: new Date().toISOString(),
          status: 'sending',
        };
        qc.setQueryData<import('@/domain/models/message').Message[]>(queryKey, [...prev, optimistic]);
      }
      return { prev, conversationId };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(messagingKeys.messages(ctx.conversationId), ctx.prev);
      }
    },
    onSuccess: (_data, vars) => {
      void qc.invalidateQueries({ queryKey: messagingKeys.messages(vars.conversationId) });
      void qc.invalidateQueries({ queryKey: messagingKeys.conversations() });
    },
  });
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: string) => messagingService.markRead(conversationId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: messagingKeys.conversations() });
    },
  });
}
