import { useCallback } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  Image,
  Pressable,
} from 'react-native';
import { Bell, ChevronRight, MapPin } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { SectionHeader } from '@/components/common/SectionHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { AppText, AppHeading } from '@/components/ui/AppText';
import { InterestChip } from '@/components/ui/InterestChip';
import { IconButton } from '@/components/ui/IconButton';
import { useTheme } from '@/theme/ThemeProvider';
import { useDiscover } from '@/features/discovery/hooks/useDiscover';
import type { Candidate } from '@/domain/models/profile';

function CandidateCard({ candidate, onPress }: { candidate: Candidate; onPress: () => void }) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.lg,
          opacity: pressed ? 0.97 : 1,
        },
      ]}
    >
      <Image source={{ uri: candidate.photoUrl }} style={styles.portrait} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View>
            <AppHeading size="xl">
              {candidate.displayName}, {candidate.age}
            </AppHeading>
            <View style={styles.locationRow}>
              <MapPin size={14} color={theme.colors.textMuted} />
              <AppText size="sm" color={theme.colors.textMuted}>
                {candidate.city}
              </AppText>
            </View>
          </View>
          <ChevronRight size={20} color={theme.colors.textMuted} />
        </View>

        <AppText size="sm" color={theme.colors.text} style={{ marginTop: 12, lineHeight: 20 }} numberOfLines={2}>
          {candidate.compatibilityReasons[0]}
        </AppText>

        <View style={styles.chipsRow}>
          {candidate.sharedInterests.slice(0, 3).map((interest) => (
            <InterestChip key={interest} label={interest} selected size="sm" />
          ))}
          {candidate.sharedValues.length > 0 && (
            <InterestChip label={candidate.sharedValues[0]} size="sm" />
          )}
        </View>

        <View style={[styles.scoreBar, { backgroundColor: theme.colors.skeleton, borderRadius: theme.radii.full }]}>
          <View
            style={[
              styles.scoreFill,
              {
                width: `${candidate.compatibilityScore}%`,
                backgroundColor: theme.colors.accent,
                borderRadius: theme.radii.full,
              },
            ]}
          />
        </View>
        <AppText size="xs" color={theme.colors.textMuted} style={{ marginTop: 6 }}>
          {candidate.compatibilityScore}% compatibility alignment
        </AppText>
      </View>
    </Pressable>
  );
}

export default function DiscoverScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { data, isPending, isError, isRefetching, refetch } = useDiscover();

  const handleCandidatePress = useCallback(
    (id: string) => {
      router.push(`/candidate/${id}`);
    },
    [router],
  );

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <AppText size="sm" color={theme.colors.textMuted}>
            Good morning
          </AppText>
          <AppHeading size="3xl">Discover</AppHeading>
        </View>
        <IconButton
          onPress={() => router.push('/notifications')}
          icon={<Bell size={22} color={theme.colors.text} strokeWidth={2} />}
        />
      </View>

      <SectionHeader
        title="Your kind of connection"
        subtitle="Curated people who share your values and interests"
      />

      {isPending ? (
        <LoadingSkeleton count={3} />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : !data || data.length === 0 ? (
        <EmptyState
          title="No introductions right now"
          message="We are looking for people who match your values and preferences. Check back soon."
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CandidateCard candidate={item} onPress={() => handleCandidatePress(item.id)} />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => void refetch()}
              tintColor={theme.colors.accent}
            />
          }
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  card: { overflow: 'hidden' },
  portrait: { width: '100%', height: 280, resizeMode: 'cover' },
  cardContent: { padding: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  chipsRow: { flexDirection: 'row', gap: 6, marginTop: 12, flexWrap: 'wrap' },
  scoreBar: { height: 6, marginTop: 16, width: '100%' },
  scoreFill: { height: 6 },
});
