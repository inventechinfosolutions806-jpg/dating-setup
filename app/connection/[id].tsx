import { StyleSheet, View, ScrollView, Alert, Pressable } from 'react-native';
import { ArrowLeft, MessageCircle, Ban, Flag, Archive, MoreHorizontal } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { AppText, AppHeading } from '@/components/ui/AppText';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { IconButton } from '@/components/ui/IconButton';
import { AppButton } from '@/components/ui/AppButton';
import { InterestChip } from '@/components/ui/InterestChip';
import { ConnectionStatusBadge } from '@/components/ui/ConnectionStatusBadge';
import { useTheme } from '@/theme/ThemeProvider';
import { useConnection, useEndConnection, useArchiveConnection } from '@/features/connections/hooks/useConnections';
import { dayjs } from '@/shared/lib/dayjs';
import { useState } from 'react';

export default function ConnectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { data: conn, isPending, isError } = useConnection(id);
  const endConn = useEndConnection();
  const archiveConn = useArchiveConnection();
  const [menuOpen, setMenuOpen] = useState(false);

  if (isPending) {
    return (
      <ScreenContainer scroll={false}>
        <View style={styles.topBar}>
          <IconButton onPress={() => router.back()} icon={<ArrowLeft size={22} color={theme.colors.text} strokeWidth={2} />} variant="ghost" />
        </View>
        <LoadingSkeleton count={2} />
      </ScreenContainer>
    );
  }
  if (isError || !conn) {
    return (
      <ScreenContainer scroll={false}>
        <View style={styles.topBar}>
          <IconButton onPress={() => router.back()} icon={<ArrowLeft size={22} color={theme.colors.text} strokeWidth={2} />} variant="ghost" />
        </View>
        <ErrorState />
      </ScreenContainer>
    );
  }

  const handleEnd = () => {
    Alert.alert(
      `End connection with ${conn.displayName}?`,
      'You will no longer be able to message each other.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'End', style: 'destructive', onPress: () => endConn.mutate(conn.id, { onSuccess: () => router.back() }) },
      ],
    );
    setMenuOpen(false);
  };

  const handleArchive = () => {
    archiveConn.mutate(conn.id, { onSuccess: () => router.back() });
    setMenuOpen(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.topBar}>
        <IconButton onPress={() => router.back()} icon={<ArrowLeft size={22} color={theme.colors.text} strokeWidth={2} />} variant="ghost" />
        <IconButton
          onPress={() => setMenuOpen((v) => !v)}
          icon={<MoreHorizontal size={22} color={theme.colors.text} strokeWidth={2} />}
          variant="ghost"
        />
      </View>

      {menuOpen && (
        <View style={[styles.menu, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.md }]}>
          {conn.status === 'active' && (
            <>
              <Pressable onPress={handleArchive} style={styles.menuItem}>
                <Archive size={18} color={theme.colors.text} strokeWidth={2} />
                <AppText size="sm">Archive</AppText>
              </Pressable>
              <Pressable onPress={handleEnd} style={styles.menuItem}>
                <Ban size={18} color={theme.colors.error} strokeWidth={2} />
                <AppText size="sm" color={theme.colors.error}>End connection</AppText>
              </Pressable>
              <Pressable onPress={() => { setMenuOpen(false); router.push(`/report-user/${conn.userId}`); }} style={styles.menuItem}>
                <Flag size={18} color={theme.colors.error} strokeWidth={2} />
                <AppText size="sm" color={theme.colors.error}>Report</AppText>
              </Pressable>
            </>
          )}
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <View style={styles.header}>
          <ProfileAvatar uri={conn.photoUrl} size={96} style={{ borderWidth: 3, borderColor: theme.colors.accent }} />
          <AppHeading size="2xl" style={{ marginTop: 16 }}>{conn.displayName}, {conn.age}</AppHeading>
          <View style={styles.statusRow}>
            <ConnectionStatusBadge status={conn.status} />
            <AppText size="sm" color={theme.colors.textMuted}>
              Connected {dayjs(conn.connectedAt).format('MMM D, YYYY')}
            </AppText>
          </View>
          <AppText size="sm" color={theme.colors.textMuted} style={{ marginTop: 4 }}>{conn.city}</AppText>
        </View>

        <View style={styles.section}>
          <AppText size="sm" weight="semibold" color={theme.colors.textMuted}>SHARED INTERESTS</AppText>
          <View style={styles.chipsWrap}>
            {conn.sharedInterests.map((si) => (
              <InterestChip key={si} label={si} selected size="sm" />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <AppText size="sm" weight="semibold" color={theme.colors.textMuted}>LAST ACTIVITY</AppText>
          <AppText size="md" style={{ marginTop: 8 }}>{dayjs(conn.lastActivity).format('MMMM D, h:mm A')}</AppText>
        </View>

        {conn.status === 'active' && (
          <AppButton
            label="Open conversation"
            onPress={() => router.push(`/chat/conv-001`)}
            fullWidth
            leftIcon={<MessageCircle size={18} color="#FFFFFF" strokeWidth={2} />}
            style={{ marginTop: 24 }}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 56, paddingBottom: 8 },
  menu: { position: 'absolute', top: 100, right: 16, paddingVertical: 8, zIndex: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 12 },
  header: { alignItems: 'center', marginTop: 16 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  section: { marginTop: 28 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
});
