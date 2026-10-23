import { StyleSheet, View, Pressable, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, AppHeading } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { useTheme } from '@/theme/ThemeProvider';

export default function WelcomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ImageBackground
        source={{ uri: 'https://images.pexels.com/photos/2530364/pexels-photo-2530364.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' }}
        style={styles.hero}
        imageStyle={{ opacity: 0.3 }}
      >
        <View style={styles.content}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <AppHeading size="4xl" align="center">MIRROR</AppHeading>
            <AppText size="lg" color={theme.colors.textMuted} align="center" style={{ marginTop: 8 }}>
              Friendship first.{'\n'}Chemistry follows.
            </AppText>
          </View>
          <View style={styles.actions}>
            <AppButton label="Create account" onPress={() => router.push('/auth/signup')} fullWidth size="lg" />
            <Pressable onPress={() => router.push('/auth/signin')} style={styles.signinLink}>
              <AppText size="md" color={theme.colors.textMuted}>
                Already have an account? <AppText size="md" weight="semibold" color={theme.colors.accent}>Sign in</AppText>
              </AppText>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { flex: 1 },
  content: { flex: 1, padding: 24, paddingTop: 56 },
  actions: { paddingBottom: 40, gap: 16 },
  signinLink: { alignItems: 'center', paddingVertical: 12 },
});
