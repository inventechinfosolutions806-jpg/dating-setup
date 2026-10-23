import { useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { AppText, AppHeading } from '@/components/ui/AppText';
import { AppInput } from '@/components/ui/AppInput';
import { AppButton } from '@/components/ui/AppButton';
import { IconButton } from '@/components/ui/IconButton';
import { InterestChip } from '@/components/ui/InterestChip';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuthSession } from '@/features/auth/store/auth-session.store';
import { useUpdateProfile } from '@/features/auth/hooks/useAuth';

const ALL_INTERESTS = [
  'reading', 'hiking', 'cooking', 'philosophy', 'indie music', 'photography',
  'art', 'travel', 'gardening', 'meditation', 'baking', 'technology', 'film',
  'sports', 'writing', 'activism', 'gaming', 'dogs', 'architecture', 'swimming',
];

export default function EditProfileScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const user = useAuthSession((s) => s.user);
  const updateProfile = useUpdateProfile();

  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [city, setCity] = useState(user?.city ?? '');
  const [interests, setInterests] = useState<string[]>(user?.interests ?? []);

  const toggleInterest = useCallback((interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest],
    );
  }, []);

  const handleSave = useCallback(() => {
    if (!displayName.trim()) {
      Alert.alert('Name required', 'Please enter a display name.');
      return;
    }
    updateProfile.mutate(
      { displayName: displayName.trim(), bio: bio.trim(), city: city.trim(), interests },
      {
        onSuccess: () => {
          Alert.alert('Profile updated', 'Your changes have been saved.');
          router.back();
        },
      },
    );
  }, [displayName, bio, city, interests, updateProfile, router]);

  if (!user) return null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.topBar}>
        <IconButton onPress={() => router.back()} icon={<ArrowLeft size={22} color={theme.colors.text} strokeWidth={2} />} variant="ghost" />
        <AppHeading size="xl">Edit profile</AppHeading>
        <IconButton
          onPress={handleSave}
          icon={<Check size={22} color={theme.colors.accent} strokeWidth={2} />}
          variant="ghost"
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <View style={styles.field}>
          <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginBottom: 6 }}>DISPLAY NAME</AppText>
          <AppInput value={displayName} onChangeText={setDisplayName} placeholder="Your name" />
        </View>
        <View style={styles.field}>
          <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginBottom: 6 }}>BIO</AppText>
          <AppInput value={bio} onChangeText={setBio} placeholder="Tell people about yourself..." multiline style={{ minHeight: 100, textAlignVertical: 'top' }} />
        </View>
        <View style={styles.field}>
          <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginBottom: 6 }}>CITY</AppText>
          <AppInput value={city} onChangeText={setCity} placeholder="Your city" />
        </View>
        <View style={styles.field}>
          <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginBottom: 12 }}>INTERESTS</AppText>
          <View style={styles.chipsWrap}>
            {ALL_INTERESTS.map((interest) => (
              <InterestChip
                key={interest}
                label={interest}
                selected={interests.includes(interest)}
                onPress={() => toggleInterest(interest)}
                size="sm"
              />
            ))}
          </View>
        </View>
        <AppButton
          label="Save changes"
          onPress={handleSave}
          loading={updateProfile.isPending}
          fullWidth
          style={{ marginTop: 24 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 56, paddingBottom: 12 },
  field: { marginTop: 20 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
