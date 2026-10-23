import { useCallback } from 'react';
import { StyleSheet, View, FlatList, Pressable } from 'react-native';
import { CheckCheck, Heart, MessageCircle, Users, Info } from 'lucide-react-native';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { AppText, AppHeading } from '@/components/ui/AppText';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { AppButton } from '@/components/ui/AppButton';
import { useTheme } from '@/theme/ThemeProvider';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/features/notifications/hooks/useNotifications';
import { useRealtimeNotifications } from '@/features/messaging/hooks/useRealtime';
import { dayjs } from '@/shared/lib/dayjs';
import type { AppNotification, NotificationType } from '@/domain/models/notification';

const iconMap: Record<NotificationType, React.ReactNode> = {
  introduction: <Users size={18} color="#C87972" strokeWidth={2} />,
  message: <MessageCircle size={18} color="#34263D" strokeWidth={2} />,
  activity: <Heart size={18} color="#8D9A86" strokeWidth={2} />,
  system: <Info size={18} color="#77717B" strokeWidth={2} />,
};

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const { data, isPending, isError, refetch } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  useRealtimeNotifications();

  const unreadCount = data?.filter((n) => !n.read).length ?? 0;

  const handlePress = useCallback(
    (notif: AppNotification) => {
      if (!notif.read) markRead.mutate(notif.id);
    },
    [markRead],
  );

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.header}>
        <AppHeading size="3xl">Notifications</AppHeading>
        {unreadCount > 0 && (
          <AppButton label="Mark all read" variant="ghost" size="sm" onPress={() => markAllRead.mutate()} />
        )}
      </View>

      {isPending ? (
        <LoadingSkeleton count={4} />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : !data || data.length === 0 ? (
        <EmptyState title="No notifications" message="You are all caught up." />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handlePress(item)}
              style={({ pressed }) => [
                styles.item,
                {
                  backgroundColor: item.read ? theme.colors.surface : theme.colors.accent + '10',
                  borderRadius: theme.radii.lg,
                  opacity: pressed ? 0.97 : 1,
                },
              ]}
            >
              {item.actionUserPhoto ? (
                <ProfileAvatar uri={item.actionUserPhoto} size={44} />
              ) : (
                <View style={[styles.iconWrap, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.full }]}>
                  {iconMap[item.type]}
                </View>
              )}
              <View style={styles.itemInfo}>
                <AppText size="sm" weight="semibold">{item.title}</AppText>
                <AppText size="sm" color={theme.colors.textMuted} style={{ marginTop: 2, lineHeight: 18 }}>
                  {item.body}
                </AppText>
                <AppText size="xs" color={theme.colors.textMuted} style={{ marginTop: 4 }}>
                  {dayjs(item.createdAt).fromNow()}
                </AppText>
              </View>
              {!item.read && <View style={[styles.dot, { backgroundColor: theme.colors.accent }]} />}
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  iconWrap: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  itemInfo: { flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 999 },
});
