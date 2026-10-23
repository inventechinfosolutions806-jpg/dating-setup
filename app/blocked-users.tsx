import { useCallback } from 'react';
import { StyleSheet, View, FlatList, Alert, Pressable } from 'react-native';
import { ArrowLeft, Ban, Trash2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { AppText, AppHeading } from '@/components/ui/AppText';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { IconButton } from '@/components/ui/IconButton';
import { AppButton } from '@/components/ui/AppButton';
import { useTheme } from '@/theme/ThemeProvider';
import { useBlockedUsers, useUnblockUser } from '@/features/safety/hooks/useSafety';
import dayjs from 'dayjs';

export default function BlockedUsersScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { data, isPending } = useBlockedUsers();
  const unblock = useUnblockUser();

  const handleUnblock = useCallback(
    (userId: string, name: string) => {
      Alert.alert(
        `Unblock ${name}?`,
        'They will be able to see your profile and send you introductions again.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Unblock', onPress: () => unblock.mutate(userId) },
        ],
      );
    },
    [unblock],
  );

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.topBar}>
        <IconButton onPress={() => router.back()} icon={<ArrowLeft size={22} color={theme.colors.text} strokeWidth={2} />} variant="ghost" />
        <AppHeading size="xl">Blocked users</AppHeading>
        <View style={{ width: 44 }} />
      </View>
      {isPending ? (
        <LoadingSkeleton count={2} />
      ) : !data || data.length === 0 ? (
        <EmptyState title="No blocked users" message="People you block will appear here." />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.item, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg }]}>
              <ProfileAvatar uri={item.photoUrl} size={48} />
              <View style={styles.itemInfo}>
                <AppText size="md" weight="semibold">{item.displayName}</AppText>
                <AppText size="sm" color={theme.colors.textMuted} style={{ marginTop: 2 }}>
                  {item.status} - {dayjs(item.blockedAt).format('MMM D, YYYY')}
                </AppText>
                {item.reason && (
                  <AppText size="xs" color={theme.colors.textMuted} style={{ marginTop: 2 }}>
                    Reason: {item.reason}
                  </AppText>
                )}
              </View>
              <AppButton label="Unblock" variant="outline" size="sm" onPress={() => handleUnblock(item.userId, item.displayName)} />
            </View>
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
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  itemInfo: { flex: 1 },
});
