import { useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AppText, AppHeading } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { IconButton } from '@/components/ui/IconButton';
import { InterestChip } from '@/components/ui/InterestChip';
import { useTheme } from '@/theme/ThemeProvider';

const RELATIONSHIP_INTENTIONS = ['friendship-first', 'open-to-romance'];
const COMMUNICATION_STYLES = ['direct', 'thoughtful', 'playful', 'reserved'];
const VALUE_OPTIONS = ['family', 'creativity', 'ambition', 'kindness', 'adventure', 'stability', 'humor', 'intellect', 'spirituality', 'community'];
const LIFESTYLE_OPTIONS = ['early-riser', 'night-owl', 'homebody', 'social', 'active', 'relaxed', 'organized', 'spontaneous'];

export default function EditPreferencesScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const [intention, setIntention] = useState('friendship-first');
  const [communication, setCommunication] = useState('thoughtful');
  const [values, setValues] = useState<string[]>(['kindness', 'creativity', 'humor']);
  const [lifestyle, setLifestyle] = useState<string[]>(['early-riser', 'active']);

  const toggle = useCallback((arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.topBar}>
        <IconButton onPress={() => router.back()} icon={<ArrowLeft size={22} color={theme.colors.text} strokeWidth={2} />} variant="ghost" />
        <AppHeading size="xl">Discovery preferences</AppHeading>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <View style={styles.section}>
          <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginBottom: 12 }}>RELATIONSHIP INTENTION</AppText>
          <View style={styles.chipsWrap}>
            {RELATIONSHIP_INTENTIONS.map((opt) => (
              <InterestChip key={opt} label={opt.replace(/-/g, ' ')} selected={intention === opt} onPress={() => setIntention(opt)} />
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginBottom: 12 }}>COMMUNICATION STYLE</AppText>
          <View style={styles.chipsWrap}>
            {COMMUNICATION_STYLES.map((opt) => (
              <InterestChip key={opt} label={opt} selected={communication === opt} onPress={() => setCommunication(opt)} />
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginBottom: 12 }}>VALUES YOU PRIORITIZE</AppText>
          <View style={styles.chipsWrap}>
            {VALUE_OPTIONS.map((opt) => (
              <InterestChip key={opt} label={opt} selected={values.includes(opt)} onPress={() => toggle(values, opt, setValues)} size="sm" />
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginBottom: 12 }}>LIFESTYLE PREFERENCES</AppText>
          <View style={styles.chipsWrap}>
            {LIFESTYLE_OPTIONS.map((opt) => (
              <InterestChip key={opt} label={opt.replace(/-/g, ' ')} selected={lifestyle.includes(opt)} onPress={() => toggle(lifestyle, opt, setLifestyle)} size="sm" />
            ))}
          </View>
        </View>
        <AppButton label="Save preferences" onPress={() => router.back()} fullWidth style={{ marginTop: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 56, paddingBottom: 12 },
  section: { marginTop: 24 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
