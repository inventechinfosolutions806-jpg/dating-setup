import { useState, useCallback } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AppText, AppHeading } from '@/components/ui/AppText';
import { AppInput } from '@/components/ui/AppInput';
import { AppButton } from '@/components/ui/AppButton';
import { IconButton } from '@/components/ui/IconButton';
import { useTheme } from '@/theme/ThemeProvider';
import { useSignUp } from '@/features/auth/hooks/useAuth';

export default function SignUpScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const signUp = useSignUp();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const validate = () => {
    const e: { name?: string; email?: string; password?: string } = {};
    if (displayName.trim().length < 2) e.name = 'Enter your name';
    if (!email.includes('@')) e.email = 'Enter a valid email';
    if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignUp = useCallback(() => {
    if (!validate()) return;
    signUp.mutate(
      { email, password, displayName: displayName.trim() },
      {
        onError: (err) => {
          Alert.alert('Sign up failed', err.message);
        },
      },
    );
  }, [displayName, email, password, signUp]);

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.topBar}>
        <IconButton onPress={() => router.back()} icon={<ArrowLeft size={22} color={theme.colors.text} strokeWidth={2} />} variant="ghost" />
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}>
        <AppHeading size="3xl">Create your account</AppHeading>
        <AppText size="md" color={theme.colors.textMuted} style={{ marginTop: 8 }}>
          Start building meaningful connections.
        </AppText>

        <View style={styles.form}>
          <View style={styles.field}>
            <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginBottom: 6 }}>DISPLAY NAME</AppText>
            <AppInput value={displayName} onChangeText={setDisplayName} placeholder="Your name" error={errors.name} />
            {errors.name && <AppText size="xs" color={theme.colors.error} style={{ marginTop: 4 }}>{errors.name}</AppText>}
          </View>
          <View style={styles.field}>
            <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginBottom: 6 }}>EMAIL</AppText>
            <AppInput value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" error={errors.email} />
            {errors.email && <AppText size="xs" color={theme.colors.error} style={{ marginTop: 4 }}>{errors.email}</AppText>}
          </View>
          <View style={styles.field}>
            <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginBottom: 6 }}>PASSWORD</AppText>
            <AppInput value={password} onChangeText={setPassword} placeholder="At least 6 characters" secureTextEntry error={errors.password} />
            {errors.password && <AppText size="xs" color={theme.colors.error} style={{ marginTop: 4 }}>{errors.password}</AppText>}
          </View>
          <AppButton
            label="Create account"
            onPress={handleSignUp}
            loading={signUp.isPending}
            fullWidth
            size="lg"
            style={{ marginTop: 8 }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  topBar: { paddingHorizontal: 12, paddingTop: 56 },
  form: { marginTop: 32, gap: 16 },
  field: {},
});
