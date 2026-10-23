import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AppText, AppHeading } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import { AppButton } from '@/components/ui/AppButton';
import { useTheme } from '@/theme/ThemeProvider';
import { useSubscriptionPlans, useSelectPlan, useCurrentSubscription } from '@/features/subscriptions/hooks/useSubscriptions';
import type { SubscriptionPlan } from '@/domain/models/subscription';

export default function SubscriptionPlansScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { data: plans } = useSubscriptionPlans();
  const { data: currentState } = useCurrentSubscription();
  const selectPlan = useSelectPlan();

  const handleSelect = (plan: SubscriptionPlan) => {
    if (plan.tier === currentState?.currentTier) return;
    Alert.alert(
      `Switch to ${plan.name}?`,
      'This is a demo. No real payment will be processed.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => selectPlan.mutate(plan.id, { onSuccess: () => router.back() }) },
      ],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.topBar}>
        <IconButton onPress={() => router.back()} icon={<ArrowLeft size={22} color={theme.colors.text} strokeWidth={2} />} variant="ghost" />
        <AppHeading size="xl">Plans</AppHeading>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <AppText size="md" color={theme.colors.textMuted} style={{ lineHeight: 22, marginBottom: 24 }}>
          Choose the plan that fits your journey. All plans include core discovery and safety features.
        </AppText>
        {plans?.map((plan) => {
          const isCurrent = plan.tier === currentState?.currentTier;
          const isPopular = plan.tier === 'plus';
          return (
            <View
              key={plan.id}
              style={[
                styles.planCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.radii.lg,
                  borderColor: isCurrent ? theme.colors.accent : theme.colors.border,
                  borderWidth: isCurrent ? 2 : 1,
                },
              ]}
            >
              {isPopular && !isCurrent && (
                <View style={[styles.popularBadge, { backgroundColor: theme.colors.accent, borderRadius: theme.radii.full }]}>
                  <AppText size="xs" color="#FFFFFF" weight="semibold">POPULAR</AppText>
                </View>
              )}
              <AppHeading size="2xl">{plan.name}</AppHeading>
              <View style={styles.priceRow}>
                <AppHeading size="3xl">{plan.price}</AppHeading>
                {plan.period && <AppText size="sm" color={theme.colors.textMuted}> {plan.period}</AppText>}
              </View>
              <AppText size="sm" color={theme.colors.textMuted} style={{ marginTop: 8, lineHeight: 20 }}>{plan.description}</AppText>
              <View style={{ marginTop: 16, gap: 10 }}>
                {plan.features.map((f) => (
                  <View key={f} style={styles.featureRow}>
                    <Check size={16} color={theme.colors.success} strokeWidth={2} />
                    <AppText size="sm" style={{ flex: 1, lineHeight: 20 }}>{f}</AppText>
                  </View>
                ))}
              </View>
              <AppButton
                label={isCurrent ? 'Current plan' : `Select ${plan.name}`}
                variant={isCurrent ? 'outline' : 'primary'}
                onPress={() => handleSelect(plan)}
                disabled={isCurrent}
                loading={selectPlan.isPending}
                fullWidth
                style={{ marginTop: 20 }}
              />
            </View>
          );
        })}
        <AppText size="xs" color={theme.colors.textMuted} align="center" style={{ marginTop: 20 }}>
          Demo mode - no real payments are processed.
        </AppText>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 56, paddingBottom: 12 },
  planCard: { padding: 24, marginTop: 16, position: 'relative' },
  popularBadge: { position: 'absolute', top: 12, right: 12, paddingHorizontal: 10, paddingVertical: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
});
