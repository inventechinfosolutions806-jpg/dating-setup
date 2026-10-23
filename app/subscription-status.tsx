import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { ArrowLeft, Crown, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AppText, AppHeading } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import { AppButton } from '@/components/ui/AppButton';
import { SettingsRow } from '@/components/ui/SettingsRow';
import { useTheme } from '@/theme/ThemeProvider';
import { useCurrentSubscription, useSubscriptionPlans } from '@/features/subscriptions/hooks/useSubscriptions';
import { ChevronRight } from 'lucide-react-native';

export default function SubscriptionStatusScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { data: subState } = useCurrentSubscription();
  const { data: plans } = useSubscriptionPlans();

  const currentPlan = plans?.find((p) => p.tier === subState?.currentTier);
  const tierLabel = subState?.currentTier ? subState.currentTier.charAt(0).toUpperCase() + subState.currentTier.slice(1) : 'Free';

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.topBar}>
        <IconButton onPress={() => router.back()} icon={<ArrowLeft size={22} color={theme.colors.text} strokeWidth={2} />} variant="ghost" />
        <AppHeading size="xl">Subscription</AppHeading>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <View style={[styles.statusCard, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg }]}>
          <View style={[styles.tierIcon, { backgroundColor: theme.colors.accent + '20', borderRadius: theme.radii.full }]}>
            <Crown size={28} color={theme.colors.accent} strokeWidth={2} />
          </View>
          <AppHeading size="2xl" style={{ marginTop: 16 }}>{tierLabel} plan</AppHeading>
          <AppText size="sm" color={theme.colors.textMuted} style={{ marginTop: 4 }}>
            {subState?.status === 'active' ? 'Active' : 'No active subscription'}
          </AppText>
          {currentPlan && (
            <View style={{ marginTop: 16, gap: 8 }}>
              {currentPlan.features.map((f) => (
                <View key={f} style={styles.featureRow}>
                  <Check size={14} color={theme.colors.success} strokeWidth={2} />
                  <AppText size="sm" style={{ flex: 1 }}>{f}</AppText>
                </View>
              ))}
            </View>
          )}
        </View>

        <AppButton label="View all plans" onPress={() => router.push('/subscription-plans')} fullWidth style={{ marginTop: 16 }} />

        <AppText size="xs" color={theme.colors.textMuted} align="center" style={{ marginTop: 16 }}>
          This is a demo subscription. No real billing is active.
        </AppText>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 56, paddingBottom: 12 },
  statusCard: { padding: 24, alignItems: 'center' },
  tierIcon: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
});
