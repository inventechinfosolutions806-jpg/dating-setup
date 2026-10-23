import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { ArrowLeft, Download, Trash2, Shield } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AppText, AppHeading } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import { AppButton } from '@/components/ui/AppButton';
import { useTheme } from '@/theme/ThemeProvider';

export default function DataExportScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const handleExport = () => {
    Alert.alert(
      'Export your data',
      'In a production environment, this would generate a downloadable file containing your profile data, connections, and messages. This is a demo.',
      [{ text: 'OK' }],
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete your account?',
      'This will permanently delete your profile, connections, and messages. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          Alert.alert('Demo mode', 'Account deletion is not available in demo mode.');
        }},
      ],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.topBar}>
        <IconButton onPress={() => router.back()} icon={<ArrowLeft size={22} color={theme.colors.text} strokeWidth={2} />} variant="ghost" />
        <AppHeading size="xl">Data & privacy</AppHeading>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg }]}>
          <View style={[styles.iconWrap, { backgroundColor: theme.colors.secondary + '20', borderRadius: theme.radii.full }]}>
            <Download size={24} color={theme.colors.secondary} strokeWidth={2} />
          </View>
          <AppHeading size="lg" style={{ marginTop: 16 }}>Export your data</AppHeading>
          <AppText size="sm" color={theme.colors.textMuted} style={{ marginTop: 8, lineHeight: 20 }}>
            Download a copy of your profile, connections, messages, and activity history.
          </AppText>
          <AppButton label="Request export" variant="outline" onPress={handleExport} fullWidth style={{ marginTop: 16 }} />
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg, marginTop: 16 }]}>
          <View style={[styles.iconWrap, { backgroundColor: theme.colors.error + '20', borderRadius: theme.radii.full }]}>
            <Trash2 size={24} color={theme.colors.error} strokeWidth={2} />
          </View>
          <AppHeading size="lg" style={{ marginTop: 16 }} color={theme.colors.error}>Delete account</AppHeading>
          <AppText size="sm" color={theme.colors.textMuted} style={{ marginTop: 8, lineHeight: 20 }}>
            Permanently delete your account and all associated data. This cannot be undone.
          </AppText>
          <AppButton label="Delete my account" variant="danger" onPress={handleDelete} fullWidth style={{ marginTop: 16 }} />
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg, marginTop: 16 }]}>
          <View style={[styles.iconWrap, { backgroundColor: theme.colors.primary + '20', borderRadius: theme.radii.full }]}>
            <Shield size={24} color={theme.colors.primary} strokeWidth={2} />
          </View>
          <AppHeading size="lg" style={{ marginTop: 16 }}>Your privacy</AppHeading>
          <AppText size="sm" color={theme.colors.textMuted} style={{ marginTop: 8, lineHeight: 20 }}>
            MIRROR only collects data needed to provide meaningful connections. We never sell your data or share it with third parties.
          </AppText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 56, paddingBottom: 12 },
  card: { padding: 24 },
  iconWrap: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
});
