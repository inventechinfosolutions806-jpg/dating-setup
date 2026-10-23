import { useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { AppText, AppHeading } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { IconButton } from '@/components/ui/IconButton';
import { InterestChip } from '@/components/ui/InterestChip';
import { useTheme } from '@/theme/ThemeProvider';
import { useActivity, useStartActivity, useSubmitActivity } from '@/features/activities/hooks/useActivities';
import { useConnections } from '@/features/connections/hooks/useConnections';

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { data: activity, isPending, isError, refetch } = useActivity(id);
  const { data: connections } = useConnections();
  const startActivity = useStartActivity();
  const submitActivity = useSubmitActivity();

  const [response, setResponse] = useState('');
  const [selectedConnId, setSelectedConnId] = useState<string | null>(null);

  const activeConnections = connections?.filter((c) => c.status === 'active') ?? [];

  const handleStart = useCallback(() => {
    if (!activity || !selectedConnId) {
      Alert.alert('Select a connection', 'Choose a connection to start this activity with.');
      return;
    }
    startActivity.mutate({ id: activity.id, connectionId: selectedConnId });
  }, [activity, selectedConnId, startActivity]);

  const handleSubmit = useCallback(() => {
    if (!activity || !selectedConnId || !response.trim()) return;
    submitActivity.mutate(
      {
        activityId: activity.id,
        connectionId: selectedConnId,
        userId: 'user-001',
        response: response.trim(),
      },
      {
        onSuccess: () => {
          Alert.alert('Response submitted', 'Your partner will see your response soon.');
          setResponse('');
        },
      },
    );
  }, [activity, selectedConnId, response, submitActivity]);

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
  if (isError || !activity) {
    return (
      <ScreenContainer scroll={false}>
        <View style={styles.topBar}>
          <IconButton onPress={() => router.back()} icon={<ArrowLeft size={22} color={theme.colors.text} strokeWidth={2} />} variant="ghost" />
        </View>
        <ErrorState onRetry={() => void refetch()} />
      </ScreenContainer>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.topBar}>
        <IconButton onPress={() => router.back()} icon={<ArrowLeft size={22} color={theme.colors.text} strokeWidth={2} />} variant="ghost" />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <View style={styles.badges}>
          <InterestChip label={activity.category.replace(/-/g, ' ')} size="sm" />
          <InterestChip label={activity.depth} size="sm" selected />
        </View>
        <AppHeading size="3xl" style={{ marginTop: 16 }}>{activity.title}</AppHeading>
        <AppText size="md" color={theme.colors.textMuted} style={{ marginTop: 8, lineHeight: 24 }}>
          {activity.description}
        </AppText>

        <View style={[styles.promptBox, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.md, borderColor: theme.colors.border }]}>
          <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginBottom: 6 }}>
            Example prompt
          </AppText>
          <AppText size="md" style={{ lineHeight: 22 }}>{activity.examplePrompt}</AppText>
        </View>

        <View style={styles.metaRow}>
          <AppText size="sm" color={theme.colors.textMuted}>Estimated time: {activity.estimatedDuration}</AppText>
        </View>

        {activity.participationState === 'not-started' && activeConnections.length > 0 && (
          <View style={styles.section}>
            <AppHeading size="lg">Start with a connection</AppHeading>
            <View style={{ gap: 8, marginTop: 12 }}>
              {activeConnections.map((conn) => (
                <Pressable
                  key={conn.id}
                  onPress={() => setSelectedConnId(conn.id)}
                  style={({ pressed }) => [
                    styles.connItem,
                    {
                      backgroundColor: theme.colors.surface,
                      borderRadius: theme.radii.md,
                      borderColor: selectedConnId === conn.id ? theme.colors.accent : theme.colors.border,
                      borderWidth: selectedConnId === conn.id ? 2 : 1,
                      opacity: pressed ? 0.95 : 1,
                    },
                  ]}
                >
                  <AppText size="md" weight="medium">{conn.displayName}</AppText>
                  <AppText size="sm" color={theme.colors.textMuted}>{conn.city}</AppText>
                </Pressable>
              ))}
            </View>
            <AppButton
              label="Start activity"
              onPress={handleStart}
              loading={startActivity.isPending}
              disabled={!selectedConnId}
              fullWidth
              style={{ marginTop: 20 }}
            />
          </View>
        )}

        {activity.participationState === 'in-progress' && (
          <View style={styles.section}>
            <AppHeading size="lg">Your response</AppHeading>
            <AppInput
              value={response}
              onChangeText={setResponse}
              placeholder="Write your response..."
              multiline
              style={{ minHeight: 100, textAlignVertical: 'top' }}
            />
            <AppButton
              label="Submit response"
              onPress={handleSubmit}
              loading={submitActivity.isPending}
              disabled={!response.trim()}
              fullWidth
              style={{ marginTop: 16 }}
            />
          </View>
        )}

        {activity.participationState === 'completed' && (
          <View style={[styles.completedBox, { backgroundColor: theme.colors.success + '15', borderRadius: theme.radii.md }]}>
            <AppText size="md" weight="semibold" color={theme.colors.success}>
              Activity completed
            </AppText>
            <AppText size="sm" color={theme.colors.textMuted} style={{ marginTop: 4 }}>
              You and your partner have finished this activity.
            </AppText>
          </View>
        )}

        {activeConnections.length === 0 && activity.participationState === 'not-started' && (
          <View style={styles.section}>
            <AppText size="md" color={theme.colors.textMuted} align="center">
              You need an active connection to start this activity.
            </AppText>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

import { Pressable } from 'react-native';

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 8 },
  badges: { flexDirection: 'row', gap: 6, marginTop: 8 },
  promptBox: { padding: 16, marginTop: 20, borderWidth: 1 },
  metaRow: { marginTop: 16 },
  section: { marginTop: 28 },
  connItem: { paddingVertical: 14, paddingHorizontal: 16 },
  completedBox: { padding: 20, marginTop: 24 },
});
