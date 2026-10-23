import { StyleSheet, View, ScrollView } from 'react-native';
import { ArrowLeft, Shield, Eye, Ban, Flag, FileText, HelpCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AppText, AppHeading } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import { SettingsRow } from '@/components/ui/SettingsRow';
import { useTheme } from '@/theme/ThemeProvider';
import { ChevronRight } from 'lucide-react-native';

export default function SafetyCenterScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.topBar}>
        <IconButton onPress={() => router.back()} icon={<ArrowLeft size={22} color={theme.colors.text} strokeWidth={2} />} variant="ghost" />
        <AppHeading size="xl">Safety center</AppHeading>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <View style={[styles.banner, { backgroundColor: theme.colors.secondary + '15', borderRadius: theme.radii.lg }]}>
          <Shield size={28} color={theme.colors.secondary} strokeWidth={2} />
          <View style={{ flex: 1 }}>
            <AppText size="md" weight="semibold">Your safety matters</AppText>
            <AppText size="sm" color={theme.colors.textMuted} style={{ marginTop: 4, lineHeight: 20 }}>
              MIRROR is built on trust. Report anyone who makes you uncomfortable. All reports are confidential.
            </AppText>
          </View>
        </View>

        <View style={[styles.group, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg, marginTop: 20 }]}>
          <SettingsRow label="Blocked users" icon={<Ban size={20} color={theme.colors.text} strokeWidth={2} />} onPress={() => router.push('/blocked-users')} rightIcon={<ChevronRight size={18} color={theme.colors.textMuted} strokeWidth={2} />} />
          <SettingsRow label="Privacy & visibility" icon={<Eye size={20} color={theme.colors.text} strokeWidth={2} />} onPress={() => router.push('/privacy-settings')} rightIcon={<ChevronRight size={18} color={theme.colors.textMuted} strokeWidth={2} />} />
        </View>

        <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginTop: 24, marginBottom: 8 }}>GUIDELINES & POLICIES</AppText>
        <View style={[styles.group, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg }]}>
          <SettingsRow label="Community guidelines" icon={<FileText size={20} color={theme.colors.text} strokeWidth={2} />} onPress={() => {}} rightIcon={<ChevronRight size={18} color={theme.colors.textMuted} strokeWidth={2} />} />
          <SettingsRow label="Report a problem" icon={<Flag size={20} color={theme.colors.text} strokeWidth={2} />} onPress={() => {}} rightIcon={<ChevronRight size={18} color={theme.colors.textMuted} strokeWidth={2} />} />
          <SettingsRow label="Help & support" icon={<HelpCircle size={20} color={theme.colors.text} strokeWidth={2} />} onPress={() => {}} rightIcon={<ChevronRight size={18} color={theme.colors.textMuted} strokeWidth={2} />} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 56, paddingBottom: 12 },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 20 },
  group: { overflow: 'hidden' },
});
