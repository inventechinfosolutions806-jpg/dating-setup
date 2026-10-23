import { useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AppText, AppHeading } from '@/components/ui/AppText';
import { AppInput } from '@/components/ui/AppInput';
import { AppButton } from '@/components/ui/AppButton';
import { IconButton } from '@/components/ui/IconButton';
import { InterestChip } from '@/components/ui/InterestChip';
import { useTheme } from '@/theme/ThemeProvider';
import { useReportUser } from '@/features/safety/hooks/useSafety';

const REPORT_REASONS = [
  'Inappropriate messages',
  'Harassment or bullying',
  'Fake profile',
  'Scam or fraud',
  'Hate speech',
  'Other',
];

export default function ReportUserScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const reportMutation = useReportUser();

  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = useCallback(() => {
    if (!reason) {
      Alert.alert('Select a reason', 'Please choose a reason for reporting.');
      return;
    }
    reportMutation.mutate(
      { userId, reason: details ? `${reason}: ${details}` : reason },
      {
        onSuccess: () => {
          Alert.alert('Report submitted', 'Thank you. Our team will review this report.', [
            { text: 'OK', onPress: () => router.back() },
          ]);
        },
      },
    );
  }, [reason, details, userId, reportMutation, router]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.topBar}>
        <IconButton onPress={() => router.back()} icon={<ArrowLeft size={22} color={theme.colors.text} strokeWidth={2} />} variant="ghost" />
        <AppHeading size="xl">Report user</AppHeading>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <View style={[styles.warningBox, { backgroundColor: theme.colors.error + '10', borderRadius: theme.radii.md }]}>
          <AppText size="sm" color={theme.colors.text} style={{ lineHeight: 20 }}>
            Reports are confidential. The person will not know who reported them. Our team reviews every report carefully.
          </AppText>
        </View>
        <View style={styles.section}>
          <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginBottom: 12 }}>REASON</AppText>
          <View style={styles.chipsWrap}>
            {REPORT_REASONS.map((r) => (
              <InterestChip key={r} label={r} selected={reason === r} onPress={() => setReason(r)} size="sm" />
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginBottom: 6 }}>ADDITIONAL DETAILS (OPTIONAL)</AppText>
          <AppInput value={details} onChangeText={setDetails} placeholder="Provide more context..." multiline style={{ minHeight: 80, textAlignVertical: 'top' }} />
        </View>
        <AppButton
          label="Submit report"
          variant="danger"
          onPress={handleSubmit}
          loading={reportMutation.isPending}
          fullWidth
          style={{ marginTop: 24 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 56, paddingBottom: 12 },
  warningBox: { padding: 16, marginTop: 8 },
  section: { marginTop: 24 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
