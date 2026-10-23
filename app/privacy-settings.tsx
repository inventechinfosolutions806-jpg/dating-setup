import { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AppText, AppHeading } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import { SettingsRow } from '@/components/ui/SettingsRow';
import { useTheme } from '@/theme/ThemeProvider';

export default function PrivacySettingsScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const [showOnline, setShowOnline] = useState(false);
  const [showLocation, setShowLocation] = useState(true);
  const [showAge, setShowAge] = useState(true);
  const [allowIntro, setAllowIntro] = useState(true);
  const [showInDiscovery, setShowInDiscovery] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.topBar}>
        <IconButton onPress={() => router.back()} icon={<ArrowLeft size={22} color={theme.colors.text} strokeWidth={2} />} variant="ghost" />
        <AppHeading size="xl">Privacy & visibility</AppHeading>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <View style={[styles.group, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg }]}>
          <ToggleRow label="Show in discovery" desc="Appear in other people's discovery results" value={showInDiscovery} onChange={setShowInDiscovery} />
          <ToggleRow label="Allow introduction requests" desc="Let people send you introductions" value={allowIntro} onChange={setAllowIntro} />
        </View>
        <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginTop: 24, marginBottom: 8 }}>WHAT OTHERS CAN SEE</AppText>
        <View style={[styles.group, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg }]}>
          <ToggleRow label="Show age" value={showAge} onChange={setShowAge} />
          <ToggleRow label="Show general location" value={showLocation} onChange={setShowLocation} />
          <ToggleRow label="Show activity status" value={showOnline} onChange={setShowOnline} />
        </View>
        <AppText size="xs" color={theme.colors.textMuted} style={{ marginTop: 16, lineHeight: 18 }}>
          MIRROR never shares your exact location, private questionnaire answers, or contact details with other users.
        </AppText>
      </ScrollView>
    </View>
  );
}

import { Switch } from 'react-native';

function ToggleRow({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void }) {
  const { theme } = useTheme();
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleText}>
        <AppText size="md">{label}</AppText>
        {desc && <AppText size="xs" color={theme.colors.textMuted} style={{ marginTop: 2 }}>{desc}</AppText>}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 56, paddingBottom: 12 },
  group: { overflow: 'hidden' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(0,0,0,0.06)' },
  toggleText: { flex: 1, paddingRight: 16 },
});
