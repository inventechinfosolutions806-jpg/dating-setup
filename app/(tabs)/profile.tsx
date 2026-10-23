import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import {
  Settings,
  Bell,
  ChevronRight,
  Crown,
  Shield,
  Eye,
  Moon,
  LogOut,
  Heart,
  TrendingUp,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { AppText, AppHeading } from '@/components/ui/AppText';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { InterestChip } from '@/components/ui/InterestChip';
import { SettingsRow } from '@/components/ui/SettingsRow';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuthSession } from '@/features/auth/store/auth-session.store';
import { useSignOut } from '@/features/auth/hooks/useAuth';
import { useCurrentSubscription } from '@/features/subscriptions/hooks/useSubscriptions';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const user = useAuthSession((s) => s.user);
  const signOut = useSignOut();
  const { data: subState } = useCurrentSubscription();

  if (!user) return null;

  return (
    <ScreenContainer scroll={false}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.header}>
          <ProfileAvatar uri={user.photoUrl} size={88} style={{ borderWidth: 3, borderColor: theme.colors.accent }} />
          <AppHeading size="2xl" style={{ marginTop: 16 }}>{user.displayName}, {user.age}</AppHeading>
          <AppText size="sm" color={theme.colors.textMuted} style={{ marginTop: 4 }}>
            {user.city}, {user.region} - {user.pronouns}
          </AppText>
        </View>

        <View style={[styles.completionBar, { backgroundColor: theme.colors.skeleton, borderRadius: theme.radii.full }]}>
          <View
            style={[
              styles.completionFill,
              {
                width: `${user.profileCompletion}%`,
                backgroundColor: theme.colors.accent,
                borderRadius: theme.radii.full,
              },
            ]}
          />
        </View>
        <AppText size="xs" color={theme.colors.textMuted} style={{ marginTop: 6, textAlign: 'center' }}>
          Profile {user.profileCompletion}% complete
        </AppText>

        <View style={[styles.bioBox, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg }]}>
          <AppText size="sm" style={{ lineHeight: 22 }}>{user.bio}</AppText>
        </View>

        <View style={styles.section}>
          <AppText size="sm" weight="semibold" color={theme.colors.textMuted}>INTERESTS</AppText>
          <View style={styles.chipsWrap}>
            {user.interests.map((i) => (
              <InterestChip key={i} label={i} size="sm" />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <AppText size="sm" weight="semibold" color={theme.colors.textMuted}>VALUES</AppText>
          <View style={styles.chipsWrap}>
            {user.values.map((v) => (
              <InterestChip key={v} label={v} size="sm" selected />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <AppText size="sm" weight="semibold" color={theme.colors.textMuted}>INTENTION</AppText>
          <AppText size="md" style={{ marginTop: 8 }}>
            {user.relationshipIntent === 'friendship-first'
              ? 'Friendship first, open to seeing where things go.'
              : 'Open to romance, while valuing friendship as a foundation.'}
          </AppText>
        </View>

        <Pressable
          onPress={() => router.push('/edit-profile')}
          style={({ pressed }) => [
            styles.editBtn,
            { backgroundColor: theme.colors.surface, borderRadius: theme.radii.md, opacity: pressed ? 0.95 : 1 },
          ]}
        >
          <AppText size="md" weight="semibold" color={theme.colors.accent}>Edit profile</AppText>
          <ChevronRight size={18} color={theme.colors.accent} strokeWidth={2} />
        </Pressable>

        <View style={[styles.settingsGroup, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg }]}>
          <SettingsRow
            label="Subscription"
            value={subState ? `${subState.currentTier} plan` : 'Free plan'}
            icon={<Crown size={20} color={theme.colors.text} strokeWidth={2} />}
            onPress={() => router.push('/subscription-status')}
            rightIcon={<ChevronRight size={18} color={theme.colors.textMuted} strokeWidth={2} />}
          />
          <SettingsRow
            label="Discovery preferences"
            icon={<TrendingUp size={20} color={theme.colors.text} strokeWidth={2} />}
            onPress={() => router.push('/edit-preferences')}
            rightIcon={<ChevronRight size={18} color={theme.colors.textMuted} strokeWidth={2} />}
          />
          <SettingsRow
            label="Notifications"
            icon={<Bell size={20} color={theme.colors.text} strokeWidth={2} />}
            onPress={() => router.push('/notifications')}
            rightIcon={<ChevronRight size={18} color={theme.colors.textMuted} strokeWidth={2} />}
          />
        </View>

        <View style={[styles.settingsGroup, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg }]}>
          <SettingsRow
            label="Privacy & visibility"
            icon={<Eye size={20} color={theme.colors.text} strokeWidth={2} />}
            onPress={() => router.push('/privacy-settings')}
            rightIcon={<ChevronRight size={18} color={theme.colors.textMuted} strokeWidth={2} />}
          />
          <SettingsRow
            label="Safety center"
            icon={<Shield size={20} color={theme.colors.text} strokeWidth={2} />}
            onPress={() => router.push('/safety-center')}
            rightIcon={<ChevronRight size={18} color={theme.colors.textMuted} strokeWidth={2} />}
          />
          <SettingsRow
            label="Blocked users"
            icon={<Shield size={20} color={theme.colors.text} strokeWidth={2} />}
            onPress={() => router.push('/blocked-users')}
            rightIcon={<ChevronRight size={18} color={theme.colors.textMuted} strokeWidth={2} />}
          />
          <SettingsRow
            label="Account settings"
            icon={<Settings size={20} color={theme.colors.text} strokeWidth={2} />}
            onPress={() => router.push('/account-settings')}
            rightIcon={<ChevronRight size={18} color={theme.colors.textMuted} strokeWidth={2} />}
          />
        </View>

        <View style={[styles.settingsGroup, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg }]}>
          <SettingsRow
            label="Data export"
            icon={<Heart size={20} color={theme.colors.text} strokeWidth={2} />}
            onPress={() => router.push('/data-export')}
            rightIcon={<ChevronRight size={18} color={theme.colors.textMuted} strokeWidth={2} />}
          />
          <SettingsRow
            label="Sign out"
            icon={<LogOut size={20} color={theme.colors.error} strokeWidth={2} />}
            onPress={() => signOut.mutate()}
            destructive
            rightIcon={<ChevronRight size={18} color={theme.colors.textMuted} strokeWidth={2} />}
          />
        </View>

        <AppText size="xs" color={theme.colors.textMuted} align="center" style={{ marginTop: 24 }}>
          MIRROR - Friendship first. Chemistry follows.
        </AppText>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginTop: 16 },
  completionBar: { height: 6, marginTop: 20, width: '100%' },
  completionFill: { height: 6 },
  bioBox: { padding: 16, marginTop: 20 },
  section: { marginTop: 24 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  editBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, marginTop: 24 },
  settingsGroup: { marginTop: 16, overflow: 'hidden' },
});
