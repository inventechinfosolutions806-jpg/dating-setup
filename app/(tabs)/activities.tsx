import { StyleSheet, View, FlatList, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { AppHeading } from '@/components/ui/AppText';
import { ActivityCard } from '@/components/ui/ActivityCard';
import { useTheme } from '@/theme/ThemeProvider';
import { useActivities } from '@/features/activities/hooks/useActivities';

export default function ActivitiesScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { data, isPending, isError, refetch } = useActivities();

  return (
    <ScreenContainer scroll={false}>
      <AppHeading size="3xl" style={{ marginBottom: 8 }}>Activities</AppHeading>
      <AppHeading size="sm" color={theme.colors.textMuted} style={{ marginBottom: 20, fontWeight: '400' }}>
        Shared experiences to deepen your connections
      </AppHeading>

      {isPending ? (
        <LoadingSkeleton count={4} />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : !data || data.length === 0 ? (
        <EmptyState
          title="No activities available"
          message="Start a connection to unlock shared activities."
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ActivityCard
              activity={item}
              onPress={() => router.push(`/activity/${item.id}`)}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenContainer>
  );
}
