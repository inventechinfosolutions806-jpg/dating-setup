import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { ArrowLeft, Moon, Globe, Bell, LogOut, FileText, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AppText, AppHeading } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import { SettingsRow } from '@/components/ui/SettingsRow';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuthSession } from '@/features/auth/store/auth-session.store';
import { useSignOut } from '@/features/auth/hooks/useAuth';
import { useTheme as useThemeProvider } from '@/theme/ThemeProvider';
import { Switch } from 'react-native';
import { useState } from 'react';

export default function AccountSettingsScreen() {
  const { theme, mode, toggle } = useThemeProvider();
  const router = useRouter();
  const user = useAuthSession((s) => s.user);
  const signOut = useSignOut();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.topBar}>
        <IconButton onPress={() => router.back()} icon={<ArrowLeft size={22} color={theme.colors.text} strokeWidth={2} />} variant="ghost" />
        <AppHeading size="xl">Account settings</AppHeading>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <View style={[styles.infoBox, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg }]}>
          <AppText size="sm" weight="semibold" color={theme.colors.textMuted}>EMAIL</AppText>
          <AppText size="md" style={{ marginTop: 4 }}>{user?.email ?? 'N/A'}</AppText>
        </View>

        <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginTop: 24, marginBottom: 8 }}>APPEARANCE</AppText>
        <View style={[styles.group, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg }]}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <Moon size={20} color={theme.colors.text} strokeWidth={2} />
              <AppText size="md">Dark mode</AppText>
            </View>
            <Switch value={mode === 'dark'} onValueChange={toggle} trackColor={{ false: theme.colors.border, true: theme.colors.accent }} thumbColor="#FFFFFF" />
          </View>
        </View>

        <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginTop: 24, marginBottom: 8 }}>LEGAL</AppText>
        <View style={[styles.group, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg }]}>
          <SettingsRow label="Terms of service" icon={<FileText size={20} color={theme.colors.text} strokeWidth={2} />} onPress={() => {}} rightIcon={<ChevronRight size={18} color={theme.colors.textMuted} strokeWidth={2} />} />
          <SettingsRow label="Privacy policy" icon={<FileText size={20} color={theme.colors.text} strokeWidth={2} />} onPress={() => {}} rightIcon={<ChevronRight size={18} color={theme.colors.textMuted} strokeWidth={2} />} />
        </View>

        <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginTop: 24, marginBottom: 8 }}>ACCOUNT</AppText>
        <View style={[styles.group, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg }]}>
          <SettingsRow
            label="Sign out"
            icon={<LogOut size={20} color={theme.colors.error} strokeWidth={2} />}
            onPress={() => {
              Alert.alert('Sign out?', '', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign out', style: 'destructive', onPress: () => signOut.mutate() },
              ]);
            }}
            destructive
            rightIcon={<ChevronRight size={18} color={theme.colors.textMuted} strokeWidth={2} />}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 56, paddingBottom: 12 },
  infoBox: { padding: 16 },
  group: { overflow: 'hidden' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
