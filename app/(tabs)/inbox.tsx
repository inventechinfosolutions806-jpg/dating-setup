import { useCallback, useState } from 'react';
import { StyleSheet, View, FlatList, Pressable } from 'react-native';
import { Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { AppText, AppHeading } from '@/components/ui/AppText';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { AppInput } from '@/components/ui/AppInput';
import { useTheme } from '@/theme/ThemeProvider';
import { useConversations } from '@/features/messaging/hooks/useMessaging';
import { dayjs } from '@/shared/lib/dayjs';
import type { Conversation } from '@/domain/models/message';

export default function InboxScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { data, isPending, isError, refetch } = useConversations();
  const [search, setSearch] = useState('');

  const filtered = data?.filter((c) =>
    c.participant.displayName.toLowerCase().includes(search.toLowerCase()),
  );

  const handleOpen = useCallback(
    (conv: Conversation) => {
      router.push(`/chat/${conv.id}`);
    },
    [router],
  );

  return (
    <ScreenContainer scroll={false}>
      <AppHeading size="3xl" style={{ marginBottom: 16 }}>Inbox</AppHeading>

      <View style={{ marginBottom: 16 }}>
        <AppInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search conversations..."
          leftIcon={<Search size={18} color={theme.colors.textMuted} />}
        />
      </View>

      {isPending ? (
        <LoadingSkeleton count={4} />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : !filtered || filtered.length === 0 ? (
        <EmptyState
          title={search ? 'No conversations found' : 'No messages yet'}
          message={search ? 'Try a different search.' : 'When you connect with someone, your conversations will appear here.'}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleOpen(item)}
              style={({ pressed }) => [
                styles.convItem,
                {
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.radii.lg,
                  opacity: pressed ? 0.97 : 1,
                },
              ]}
            >
              <ProfileAvatar uri={item.participant.photoUrl} size={52} />
              <View style={styles.convInfo}>
                <View style={styles.convHeader}>
                  <AppText size="md" weight="semibold">{item.participant.displayName}</AppText>
                  {item.lastMessageAt && (
                    <AppText size="xs" color={theme.colors.textMuted}>
                      {dayjs(item.lastMessageAt).fromNow()}
                    </AppText>
                  )}
                </View>
                {item.lastMessage && (
                  <AppText
                    size="sm"
                    color={item.unreadCount > 0 ? theme.colors.text : theme.colors.textMuted}
                    numberOfLines={1}
                    style={{ marginTop: 4 }}
                  >
                    {item.lastMessage}
                  </AppText>
                )}
              </View>
              {item.unreadCount > 0 && (
                <View style={[styles.unreadBadge, { backgroundColor: theme.colors.accent }]}>
                  <AppText size="xs" color="#FFFFFF" weight="semibold">
                    {item.unreadCount}
                  </AppText>
                </View>
              )}
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  convItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  convInfo: { flex: 1 },
  convHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  unreadBadge: { minWidth: 20, height: 20, borderRadius: 999, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
});
