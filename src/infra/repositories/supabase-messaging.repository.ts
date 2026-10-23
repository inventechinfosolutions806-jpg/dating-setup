import type { MessagingRepository } from '@/domain/repositories/messaging.repository';
import type { Conversation, Message } from '@/domain/models/message';
import { NotFoundError, UnauthorizedError } from '@/domain/errors/domain-error';
import { supabase } from '@/lib/supabase';

export class SupabaseMessagingRepository implements MessagingRepository {
  async getConversations(): Promise<Conversation[]> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];

    const { data: data1, error: error1 } = await supabase
      .from('conversations')
      .select('*')
      .eq('user1_id', session.user.id)
      .order('last_message_at', { ascending: false, nullsFirst: false });

    const { data: data2, error: error2 } = await supabase
      .from('conversations')
      .select('*')
      .eq('user2_id', session.user.id)
      .order('last_message_at', { ascending: false, nullsFirst: false });

    if (error1) throw new Error(error1.message);
    if (error2) throw new Error(error2.message);

    const allConvs = [...(data1 ?? []), ...(data2 ?? [])];
    const seen = new Set<string>();
    const data = allConvs.filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });

    const conversations: Conversation[] = [];
    for (const conv of data) {
      const otherUserId = conv.user1_id === session.user.id ? conv.user2_id : conv.user1_id;
      const { data: otherProfile } = await supabase
        .from('profiles')
        .select('display_name, photo_url')
        .eq('id', otherUserId)
        .maybeSingle();

      const { data: readRow } = await supabase
        .from('conversation_reads')
        .select('last_read_at')
        .eq('conversation_id', conv.id)
        .eq('user_id', session.user.id)
        .maybeSingle();

      let unreadCount = 0;
      if (conv.last_message_at) {
        const lastReadAt = readRow?.last_read_at ?? new Date(0).toISOString();
        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .neq('sender_id', session.user.id)
          .gt('created_at', lastReadAt);

        unreadCount = count ?? 0;
      }

      conversations.push({
        id: conv.id,
        connectionId: conv.connection_id,
        participant: {
          id: otherUserId,
          displayName: otherProfile?.display_name ?? 'Unknown',
          photoUrl: otherProfile?.photo_url ?? '',
        },
        lastMessage: conv.last_message ?? undefined,
        lastMessageAt: conv.last_message_at ?? undefined,
        unreadCount,
        hasUnreadMessages: unreadCount > 0,
      });
    }

    return conversations;
  }

  async getConversation(id: string): Promise<Conversation | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return null;

    const otherUserId = data.user1_id === session.user.id ? data.user2_id : data.user1_id;
    const { data: otherProfile } = await supabase
      .from('profiles')
      .select('display_name, photo_url')
      .eq('id', otherUserId)
      .maybeSingle();

    return {
      id: data.id,
      connectionId: data.connection_id,
      participant: {
        id: otherUserId,
        displayName: otherProfile?.display_name ?? 'Unknown',
        photoUrl: otherProfile?.photo_url ?? '',
      },
      lastMessage: data.last_message ?? undefined,
      lastMessageAt: data.last_message_at ?? undefined,
      unreadCount: 0,
      hasUnreadMessages: false,
    };
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    if (!data) return [];

    return data.map((m) => ({
      id: m.id,
      conversationId: m.conversation_id,
      senderId: m.sender_id,
      text: m.text,
      createdAt: m.created_at,
      status: m.status as Message['status'],
    }));
  }

  async sendMessage(conversationId: string, text: string): Promise<Message> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new UnauthorizedError('No active session');

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: session.user.id,
        text,
        status: 'sent',
      })
      .select('*')
      .single();

    if (error) throw new Error(error.message);

    await supabase
      .from('conversations')
      .update({
        last_message: text,
        last_message_at: data.created_at,
      })
      .eq('id', conversationId);

    return {
      id: data.id,
      conversationId: data.conversation_id,
      senderId: data.sender_id,
      text: data.text,
      createdAt: data.created_at,
      status: data.status as Message['status'],
    };
  }

  async markRead(conversationId: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await supabase
      .from('conversation_reads')
      .upsert({
        conversation_id: conversationId,
        user_id: session.user.id,
        last_read_at: new Date().toISOString(),
      }, { onConflict: 'conversation_id,user_id' });
  }

  async retryMessage(_conversationId: string, messageId: string): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .update({ status: 'sent' })
      .eq('id', messageId)
      .select('*')
      .single();

    if (error) throw new NotFoundError('Message', messageId);

    return {
      id: data.id,
      conversationId: data.conversation_id,
      senderId: data.sender_id,
      text: data.text,
      createdAt: data.created_at,
      status: data.status as Message['status'],
    };
  }
}
