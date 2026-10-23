import { useState, useCallback } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AppText, AppHeading } from '@/components/ui/AppText';
import { AppInput } from '@/components/ui/AppInput';
import { AppButton } from '@/components/ui/AppButton';
import { IconButton } from '@/components/ui/IconButton';
import { useTheme } from '@/theme/ThemeProvider';
import { useSignIn } from '@/features/auth/hooks/useAuth';

export default function SignInScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const signIn = useSignIn();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: { email?: string; password?: string } = {};
    if (!email.includes('@')) e.email = 'Enter a valid email';
    if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignIn = useCallback(() => {
    if (!validate()) return;
    signIn.mutate(
      { email, password },
      {
        onError: (err) => {
          Alert.alert('Sign in failed', err.message);
        },
      },
    );
  }, [email, password, signIn]);

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.topBar}>
        <IconButton onPress={() => router.back()} icon={<ArrowLeft size={22} color={theme.colors.text} strokeWidth={2} />} variant="ghost" />
      </View>
      <View style={styles.content}>
        <AppHeading size="3xl">Welcome back</AppHeading>
        <AppText size="md" color={theme.colors.textMuted} style={{ marginTop: 8 }}>
          Sign in to continue your journey.
        </AppText>

        <View style={styles.form}>
          <View style={styles.field}>
            <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginBottom: 6 }}>EMAIL</AppText>
            <AppInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            {errors.email && <AppText size="xs" color={theme.colors.error} style={{ marginTop: 4 }}>{errors.email}</AppText>}
          </View>
          <View style={styles.field}>
            <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginBottom: 6 }}>PASSWORD</AppText>
            <AppInput
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
              secureTextEntry
              error={errors.password}
            />
            {errors.password && <AppText size="xs" color={theme.colors.error} style={{ marginTop: 4 }}>{errors.password}</AppText>}
          </View>
          <AppButton
            label="Sign in"
            onPress={handleSignIn}
            loading={signIn.isPending}
            fullWidth
            size="lg"
            style={{ marginTop: 8 }}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  topBar: { paddingHorizontal: 12, paddingTop: 56 },
  content: { flex: 1, padding: 24 },
  form: { marginTop: 32, gap: 16 },
  field: {},
});
