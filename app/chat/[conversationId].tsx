import { useCallback, useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
} from 'react-native';
import { ArrowLeft, Send, MoreHorizontal, Ban, Flag } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AppText } from '@/components/ui/AppText';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { IconButton } from '@/components/ui/IconButton';
import { AppInput } from '@/components/ui/AppInput';
import { MessageBubble } from '@/components/ui/MessageBubble';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { useTheme } from '@/theme/ThemeProvider';
import { useMessages, useSendMessage, useMarkRead } from '@/features/messaging/hooks/useMessaging';
import { useConversations } from '@/features/messaging/hooks/useMessaging';
import { useRealtimeMessages } from '@/features/messaging/hooks/useRealtime';
import { useBlockUser } from '@/features/safety/hooks/useSafety';
import { useAuthSession } from '@/features/auth/store/auth-session.store';
import { dayjs } from '@/shared/lib/dayjs';
import type { Message } from '@/domain/models/message';

export default function ChatScreen() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { data: conversations } = useConversations();
  const { data: messages, isPending } = useMessages(conversationId);
  const sendMessage = useSendMessage();
  const markRead = useMarkRead();
  const blockMutation = useBlockUser();
  const { user } = useAuthSession();
  useRealtimeMessages(conversationId);

  const [text, setText] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);

  const conversation = conversations?.find((c) => c.id === conversationId);

  useEffect(() => {
    if (conversationId && conversation && conversation.unreadCount > 0) {
      markRead.mutate(conversationId);
    }
  }, [conversationId, conversation, markRead]);

  const handleSend = useCallback(() => {
    if (!text.trim() || !conversationId) return;
    const msg = text.trim();
    setText('');
    sendMessage.mutate(
      { conversationId, text: msg },
      {
        onError: () => {
          Alert.alert('Failed to send', 'Your message could not be delivered. Tap to retry.');
          setText(msg);
        },
      },
    );
  }, [text, conversationId, sendMessage]);

  const handleBlock = useCallback(() => {
    if (!conversation) return;
    Alert.alert(
      'Block ' + conversation.participant.displayName + '?',
      'They will not be able to contact you.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: () => {
            blockMutation.mutate(
              { userId: conversation.participant.id },
              { onSuccess: () => router.back() },
            );
          },
        },
      ],
    );
    setMenuOpen(false);
  }, [conversation, blockMutation, router]);

  if (!conversation) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={styles.topBar}>
          <IconButton onPress={() => router.back()} icon={<ArrowLeft size={22} color={theme.colors.text} strokeWidth={2} />} variant="ghost" />
        </View>
        <EmptyState title="Conversation not found" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={[styles.topBar, { borderBottomColor: theme.colors.border }]}>
        <IconButton onPress={() => router.back()} icon={<ArrowLeft size={22} color={theme.colors.text} strokeWidth={2} />} variant="ghost" />
        <View style={styles.topBarCenter}>
          <ProfileAvatar uri={conversation.participant.photoUrl} size={36} />
          <AppText size="md" weight="semibold">{conversation.participant.displayName}</AppText>
        </View>
        <IconButton
          onPress={() => setMenuOpen((v) => !v)}
          icon={<MoreHorizontal size={22} color={theme.colors.text} strokeWidth={2} />}
          variant="ghost"
        />
      </View>

      {menuOpen && (
        <View style={[styles.menu, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.md }]}>
          <Pressable onPress={handleBlock} style={styles.menuItem}>
            <Ban size={18} color={theme.colors.error} strokeWidth={2} />
            <AppText size="sm" color={theme.colors.error}>Block</AppText>
          </Pressable>
          <Pressable
            onPress={() => { setMenuOpen(false); router.push(`/report-user/${conversation.participant.id}`); }}
            style={styles.menuItem}
          >
            <Flag size={18} color={theme.colors.error} strokeWidth={2} />
            <AppText size="sm" color={theme.colors.error}>Report</AppText>
          </Pressable>
        </View>
      )}

      {isPending ? (
        <LoadingSkeleton count={3} />
      ) : !messages || messages.length === 0 ? (
        <EmptyState
          title="Start the conversation"
          message="Say hello and see where things go."
        />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            const isOwn = user ? item.senderId === user.id : false;
            const prev = messages[index - 1];
            const showTimestamp = !prev || dayjs(item.createdAt).diff(prev.createdAt, 'hour') > 1;
            return (
              <MessageBubble message={item} isOwn={isOwn} showTimestamp={showTimestamp} />
            );
          }}
          contentContainerStyle={{ paddingVertical: 16, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
      )}

      <View style={[styles.composer, { borderTopColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
        <AppInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          style={{ flex: 1 }}
          multiline
        />
        <IconButton
          onPress={handleSend}
          disabled={!text.trim()}
          icon={<Send size={20} color={text.trim() ? '#FFFFFF' : theme.colors.textMuted} strokeWidth={2} />}
          style={{ backgroundColor: text.trim() ? theme.colors.accent : theme.colors.border }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 56,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  topBarCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  menu: {
    position: 'absolute',
    top: 100,
    right: 16,
    paddingVertical: 8,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 12 },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 12,
    paddingBottom: 36,
    borderTopWidth: 1,
    gap: 8,
  },
});
