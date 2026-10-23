import { useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Pressable,
  Alert,
  SectionList,
} from 'react-native';
import { Check, X, MessageCircle, MoreHorizontal, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { AppText, AppHeading } from '@/components/ui/AppText';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { InterestChip } from '@/components/ui/InterestChip';
import { ConnectionStatusBadge } from '@/components/ui/ConnectionStatusBadge';
import { AppButton } from '@/components/ui/AppButton';
import { useTheme } from '@/theme/ThemeProvider';
import { useConnections } from '@/features/connections/hooks/useConnections';
import { useEndConnection, useArchiveConnection } from '@/features/connections/hooks/useConnections';
import { useReceivedIntroductions, useUpdateIntroductionStatus } from '@/features/introductions/hooks/useIntroductions';
import { dayjs } from '@/shared/lib/dayjs';
import type { Connection, Introduction } from '@/domain/models';

type ListItem = (Introduction & { _type: 'intro' }) | Connection;

export default function ConnectionsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { data: connections, isPending: connPending, isError: connError, refetch: connRefetch } = useConnections();
  const { data: introductions, isPending: introPending } = useReceivedIntroductions();
  const updateIntroStatus = useUpdateIntroductionStatus();
  const endConnection = useEndConnection();
  const archiveConnection = useArchiveConnection();

  const pendingIntros = introductions?.filter((i) => i.status === 'pending') ?? [];
  const activeConns = connections?.filter((c) => c.status === 'active') ?? [];
  const pendingConns = connections?.filter((c) => c.status === 'pending') ?? [];
  const otherConns = connections?.filter((c) => c.status === 'archived' || c.status === 'ended') ?? [];

  const handleAccept = useCallback(
    (intro: Introduction) => {
      updateIntroStatus.mutate({ id: intro.id, status: 'accepted' });
    },
    [updateIntroStatus],
  );

  const handleDecline = useCallback(
    (intro: Introduction) => {
      updateIntroStatus.mutate({ id: intro.id, status: 'declined' });
    },
    [updateIntroStatus],
  );

  const handleEndConnection = useCallback(
    (conn: Connection) => {
      Alert.alert(
        'End connection with ' + conn.displayName + '?',
        'You will no longer be able to message each other.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'End',
            style: 'destructive',
            onPress: () => endConnection.mutate(conn.id),
          },
        ],
      );
    },
    [endConnection],
  );

  if (connPending || introPending) {
    return (
      <ScreenContainer>
        <SectionHeader title="Connections" />
        <LoadingSkeleton count={3} />
      </ScreenContainer>
    );
  }
  if (connError) {
    return (
      <ScreenContainer>
        <SectionHeader title="Connections" />
        <ErrorState onRetry={() => void connRefetch()} />
      </ScreenContainer>
    );
  }

  const hasData = pendingIntros.length > 0 || activeConns.length > 0 || pendingConns.length > 0 || otherConns.length > 0;

  return (
    <ScreenContainer scroll={false}>
      <AppHeading size="3xl" style={{ marginBottom: 20 }}>Connections</AppHeading>

      {!hasData ? (
        <EmptyState
          title="No connections yet"
          message="When you send or receive introduction requests, they will appear here."
        />
      ) : (
        <SectionList<ListItem>
          sections={[
            ...(pendingIntros.length > 0
              ? [{ title: 'New introductions', data: pendingIntros.map((i) => ({ ...i, _type: 'intro' as const })) }]
              : []),
            ...(pendingConns.length > 0
              ? [{ title: 'Pending connections', data: pendingConns as ListItem[] }]
              : []),
            ...(activeConns.length > 0
              ? [{ title: 'Active connections', data: activeConns as ListItem[] }]
              : []),
            ...(otherConns.length > 0
              ? [{ title: 'Archived & ended', data: otherConns as ListItem[] }]
              : []),
          ]}
          keyExtractor={(item) => ('_type' in item ? `intro-${item.id}` : `conn-${item.id}`)}
          renderSectionHeader={({ section: { title } }) => (
            <View style={[styles.sectionHeader, { backgroundColor: theme.colors.background }]}>
              <AppText size="sm" weight="semibold" color={theme.colors.textMuted}>
                {title.toUpperCase()}
              </AppText>
            </View>
          )}
          renderItem={({ item, section }) => {
            if ('_type' in item) {
              const intro = item;
              return (
                <View style={[styles.card, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg }]}>
                  <View style={styles.cardRow}>
                    <ProfileAvatar uri={intro.candidate.photoUrl} size={56} />
                    <View style={styles.cardInfo}>
                      <AppText size="md" weight="semibold">
                        {intro.candidate.displayName}, {intro.candidate.age}
                      </AppText>
                      <AppText size="sm" color={theme.colors.textMuted} style={{ marginTop: 2 }}>
                        {intro.candidate.city}
                      </AppText>
                    </View>
                  </View>
                  <AppText size="sm" color={theme.colors.text} style={{ marginTop: 12, lineHeight: 20 }}>
                    "{intro.message}"
                  </AppText>
                  <View style={styles.chipsRow}>
                    {intro.sharedInterests.map((si) => (
                      <InterestChip key={si} label={si} size="sm" />
                    ))}
                  </View>
                  <View style={styles.introActions}>
                    <AppButton
                      label="Decline"
                      variant="outline"
                      size="sm"
                      onPress={() => handleDecline(intro)}
                      loading={updateIntroStatus.isPending}
                      style={{ flex: 1 }}
                      fullWidth
                    />
                    <AppButton
                      label="Accept"
                      size="sm"
                      onPress={() => handleAccept(intro)}
                      loading={updateIntroStatus.isPending}
                      style={{ flex: 1 }}
                      fullWidth
                    />
                  </View>
                </View>
              );
            }
            const conn = item as Connection;
            return (
              <Pressable
                onPress={() => {
                  const conv = `conv-00${conn.id.replace('conn-', '')}`;
                  router.push(`/chat/conv-001`);
                }}
                style={({ pressed }) => [
                  styles.card,
                  {
                    backgroundColor: theme.colors.surface,
                    borderRadius: theme.radii.lg,
                    opacity: pressed ? 0.97 : 1,
                  },
                ]}
              >
                <View style={styles.cardRow}>
                  <ProfileAvatar uri={conn.photoUrl} size={56} />
                  <View style={styles.cardInfo}>
                    <View style={styles.nameRow}>
                      <AppText size="md" weight="semibold">
                        {conn.displayName}, {conn.age}
                      </AppText>
                      <ConnectionStatusBadge status={conn.status} />
                    </View>
                    <AppText size="sm" color={theme.colors.textMuted} style={{ marginTop: 2 }}>
                      {conn.city} - {dayjs(conn.lastActivity).fromNow()}
                    </AppText>
                  </View>
                </View>
                <View style={styles.cardFooter}>
                  <View style={styles.chipsRow}>
                    {conn.sharedInterests.slice(0, 3).map((si) => (
                      <InterestChip key={si} label={si} size="sm" />
                    ))}
                  </View>
                  {conn.hasUnreadMessages && (
                    <View style={[styles.unreadDot, { backgroundColor: theme.colors.accent }]} />
                  )}
                </View>
                {conn.status === 'active' && (
                  <View style={styles.connActions}>
                    <AppButton
                      label="Message"
                      variant="ghost"
                      size="sm"
                      onPress={() => router.push(`/chat/conv-001`)}
                    />
                    <AppButton
                      label="End"
                      variant="ghost"
                      size="sm"
                      onPress={() => handleEndConnection(conn)}
                    />
                  </View>
                )}
              </Pressable>
            );
          }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenContainer>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <AppHeading size="3xl" style={{ marginBottom: 20 }}>{title}</AppHeading>;
}

const styles = StyleSheet.create({
  sectionHeader: { paddingTop: 16, paddingBottom: 8 },
  card: { padding: 16 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chipsRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  unreadDot: { width: 8, height: 8, borderRadius: 999 },
  introActions: { flexDirection: 'row', gap: 12, marginTop: 14 },
  connActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
});
