import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { messagingKeys } from '../hooks/useMessaging';
import { notificationKeys } from '@/features/notifications/hooks/useNotifications';
import { authKeys } from '@/features/auth/hooks/useAuth';

export function useRealtimeMessages(conversationId: string | undefined) {
  const qc = useQueryClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          void qc.invalidateQueries({ queryKey: messagingKeys.messages(conversationId) });
          void qc.invalidateQueries({ queryKey: messagingKeys.conversations() });
        },
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [conversationId, qc]);
}

export function useRealtimeConversations() {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('conversations-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        () => {
          void qc.invalidateQueries({ queryKey: messagingKeys.conversations() });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);
}

export function useRealtimeNotifications() {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        () => {
          void qc.invalidateQueries({ queryKey: notificationKeys.list() });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);
}

export function useAuthStateListener() {
  const qc = useQueryClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (!session) {
          void qc.invalidateQueries({ queryKey: authKeys.all });
        } else {
          void qc.invalidateQueries({ queryKey: authKeys.currentUser() });
        }
      })();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [qc]);
}
