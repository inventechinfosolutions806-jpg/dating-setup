import { StyleSheet, View, Pressable } from 'react-native';
import { Clock, Layers } from 'lucide-react-native';
import { AppText, AppHeading } from '../ui/AppText';
import { InterestChip } from '../ui/InterestChip';
import { useTheme } from '@/theme/ThemeProvider';
import type { Activity } from '@/domain/models/activity';

interface ActivityCardProps {
  activity: Activity;
  onPress?: () => void;
}

export function ActivityCard({ activity, onPress }: ActivityCardProps) {
  const { theme } = useTheme();
  const depthColor: Record<Activity['depth'], string> = {
    light: theme.colors.secondary,
    moderate: theme.colors.accent,
    deep: theme.colors.primary,
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.lg,
          opacity: pressed ? 0.97 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.badges}>
          <InterestChip label={activity.category.replace(/-/g, ' ')} size="sm" />
          <View style={[styles.depthBadge, { backgroundColor: depthColor[activity.depth] + '20', borderRadius: theme.radii.full }]}>
            <Layers size={12} color={depthColor[activity.depth]} />
            <AppText size="xs" weight="medium" color={depthColor[activity.depth]}>
              {activity.depth}
            </AppText>
          </View>
        </View>
        {activity.participationState !== 'not-started' && (
          <View style={[styles.stateBadge, { backgroundColor: activity.participationState === 'completed' ? theme.colors.success + '20' : theme.colors.accent + '20' }]}>
            <AppText size="xs" weight="medium" color={activity.participationState === 'completed' ? theme.colors.success : theme.colors.accent}>
              {activity.participationState}
            </AppText>
          </View>
        )}
      </View>
      <AppHeading size="lg" style={{ marginTop: 12 }}>{activity.title}</AppHeading>
      <AppText size="sm" color={theme.colors.textMuted} style={{ marginTop: 4, lineHeight: 20 }}>
        {activity.description}
      </AppText>
      <View style={styles.footer}>
        <View style={styles.durationWrap}>
          <Clock size={14} color={theme.colors.textMuted} />
          <AppText size="xs" color={theme.colors.textMuted}>{activity.estimatedDuration}</AppText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  badges: { flexDirection: 'row', gap: 6, alignItems: 'center', flexWrap: 'wrap', flex: 1 },
  depthBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4 },
  stateBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  footer: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  durationWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
