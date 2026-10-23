import { useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Alert, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { ArrowLeft, Check, Camera } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { AppText, AppHeading } from '@/components/ui/AppText';
import { AppInput } from '@/components/ui/AppInput';
import { AppButton } from '@/components/ui/AppButton';
import { IconButton } from '@/components/ui/IconButton';
import { InterestChip } from '@/components/ui/InterestChip';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuthSession } from '@/features/auth/store/auth-session.store';
import { useUpdateProfile } from '@/features/auth/hooks/useAuth';
import { usePhotoUpload } from '@/features/auth/hooks/usePhotoUpload';

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
  const { uploadPhoto, uploading } = usePhotoUpload();

  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [city, setCity] = useState(user?.city ?? '');
  const [interests, setInterests] = useState<string[]>(user?.interests ?? []);
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl ?? '');

  const toggleInterest = useCallback((interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest],
    );
  }, []);

  const handlePickPhoto = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const url = await uploadPhoto(result.assets[0].uri);
      if (url) setPhotoUrl(url);
    }
  }, [uploadPhoto]);

  const handleSave = useCallback(() => {
    if (!displayName.trim()) {
      Alert.alert('Name required', 'Please enter a display name.');
      return;
    }
    updateProfile.mutate(
      { displayName: displayName.trim(), bio: bio.trim(), city: city.trim(), interests, photoUrl },
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
        <View style={styles.photoSection}>
          <ProfileAvatar uri={photoUrl} size={96} style={{ borderWidth: 3, borderColor: theme.colors.accent }} />
          <Pressable onPress={handlePickPhoto} style={[styles.photoBtn, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.md }]}>
            <Camera size={18} color={theme.colors.accent} strokeWidth={2} />
            <AppText size="sm" weight="semibold" color={theme.colors.accent}>{uploading ? 'Uploading...' : 'Change photo'}</AppText>
          </Pressable>
        </View>
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
  photoSection: { alignItems: 'center', marginTop: 20, gap: 12 },
  photoBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
  field: { marginTop: 20 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
