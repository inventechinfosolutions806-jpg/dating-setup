import { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AppText, AppHeading } from '@/components/ui/AppText';
import { AppInput } from '@/components/ui/AppInput';
import { AppButton } from '@/components/ui/AppButton';
import { IconButton } from '@/components/ui/IconButton';
import { InterestChip } from '@/components/ui/InterestChip';
import { useTheme } from '@/theme/ThemeProvider';
import { useUpdateProfile } from '@/features/auth/hooks/useAuth';
import { useAuthSession } from '@/features/auth/store/auth-session.store';

const ALL_INTERESTS = [
  'reading', 'hiking', 'cooking', 'philosophy', 'indie music', 'photography',
  'art', 'travel', 'gardening', 'meditation', 'baking', 'technology', 'film',
  'sports', 'writing', 'activism', 'gaming', 'dogs', 'architecture', 'swimming',
];

const VALUE_OPTIONS = ['family', 'creativity', 'ambition', 'kindness', 'adventure', 'stability', 'humor', 'intellect', 'spirituality', 'community'];
const INTENTIONS = ['friendship-first', 'open-to-romance'];
const COMMUNICATION_STYLES = ['direct', 'thoughtful', 'playful', 'reserved'];

interface OnboardingData {
  age: string;
  bio: string;
  city: string;
  pronouns: string;
  languages: string;
  interests: string[];
  intention: string;
  communication: string;
  values: string[];
}

const TOTAL_STEPS = 5;

export default function OnboardingScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const updateProfile = useUpdateProfile();
  const setUser = useAuthSession((s) => s.setUser);

  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    age: '',
    bio: '',
    city: '',
    pronouns: '',
    languages: 'English',
    interests: [],
    intention: 'friendship-first',
    communication: 'thoughtful',
    values: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0) {
      const ageNum = parseInt(data.age, 10);
      if (!data.age || isNaN(ageNum) || ageNum < 18 || ageNum > 100) e.age = 'You must be 18 or older';
    }
    if (step === 1) {
      if (data.bio.trim().length < 10) e.bio = 'Tell us a bit more (at least 10 characters)';
      if (!data.city.trim()) e.city = 'Enter your city';
    }
    if (step === 2) {
      if (data.interests.length < 3) e.interests = 'Select at least 3 interests';
    }
    if (step === 3) {
      if (data.values.length < 2) e.values = 'Select at least 2 values';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = useCallback(() => {
    if (!validateStep()) return;
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    } else {
      updateProfile.mutate(
        {
          age: parseInt(data.age, 10),
          bio: data.bio.trim(),
          city: data.city.trim(),
          pronouns: data.pronouns.trim() || undefined,
          languages: data.languages.split(',').map((l) => l.trim()).filter(Boolean),
          interests: data.interests,
          relationshipIntent: data.intention,
          communicationStyle: data.communication,
          values: data.values,
          onboarded: true,
          profileCompletion: 100,
        },
        {
          onSuccess: (user) => {
            setUser(user);
            router.replace('/(tabs)');
          },
        },
      );
    }
  }, [step, data, updateProfile, setUser, router]);

  const handleBack = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
    else router.back();
  }, [step, router]);

  const toggle = (arr: string[], item: string, field: keyof OnboardingData) => {
    const next = arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
    setData((prev) => ({ ...prev, [field]: next }));
  };

  const stepTitles = ['Age & basics', 'About you', 'Your interests', 'Values & intentions', 'Review'];

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.topBar}>
        <IconButton onPress={handleBack} icon={<ArrowLeft size={22} color={theme.colors.text} strokeWidth={2} />} variant="ghost" />
        <View style={[styles.progressTrack, { backgroundColor: theme.colors.skeleton, borderRadius: theme.radii.full }]}>
          <View style={[styles.progressFill, { width: `${((step + 1) / TOTAL_STEPS) * 100}%`, backgroundColor: theme.colors.accent, borderRadius: theme.radii.full }]} />
        </View>
        <AppText size="xs" color={theme.colors.textMuted}>{step + 1}/{TOTAL_STEPS}</AppText>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}>
        <AppHeading size="2xl" style={{ marginTop: 16 }}>{stepTitles[step]}</AppHeading>

        {step === 0 && (
          <View style={styles.form}>
            <View style={styles.field}>
              <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginBottom: 6 }}>HOW OLD ARE YOU?</AppText>
              <AppInput value={data.age} onChangeText={(v) => setData((p) => ({ ...p, age: v }))} placeholder="e.g. 28" keyboardType="numeric" error={errors.age} />
              {errors.age && <AppText size="xs" color={theme.colors.error} style={{ marginTop: 4 }}>{errors.age}</AppText>}
              <AppText size="xs" color={theme.colors.textMuted} style={{ marginTop: 8 }}>
                You must be 18 or older. This is verified in production.
              </AppText>
            </View>
            <View style={styles.field}>
              <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginBottom: 6 }}>PRONOUNS (OPTIONAL)</AppText>
              <AppInput value={data.pronouns} onChangeText={(v) => setData((p) => ({ ...p, pronouns: v }))} placeholder="e.g. she/her, they/them" />
            </View>
            <View style={styles.field}>
              <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginBottom: 6 }}>LANGUAGES</AppText>
              <AppInput value={data.languages} onChangeText={(v) => setData((p) => ({ ...p, languages: v }))} placeholder="English, Spanish" />
            </View>
          </View>
        )}

        {step === 1 && (
          <View style={styles.form}>
            <View style={styles.field}>
              <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginBottom: 6 }}>CITY</AppText>
              <AppInput value={data.city} onChangeText={(v) => setData((p) => ({ ...p, city: v }))} placeholder="e.g. Brooklyn" error={errors.city} />
              {errors.city && <AppText size="xs" color={theme.colors.error} style={{ marginTop: 4 }}>{errors.city}</AppText>}
            </View>
            <View style={styles.field}>
              <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginBottom: 6 }}>BIO</AppText>
              <AppInput value={data.bio} onChangeText={(v) => setData((p) => ({ ...p, bio: v }))} placeholder="Tell people about yourself..." multiline style={{ minHeight: 120, textAlignVertical: 'top' }} error={errors.bio} />
              {errors.bio && <AppText size="xs" color={theme.colors.error} style={{ marginTop: 4 }}>{errors.bio}</AppText>}
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.form}>
            <AppText size="sm" color={theme.colors.textMuted} style={{ marginBottom: 16 }}>Select at least 3 interests that define you.</AppText>
            <View style={styles.chipsWrap}>
              {ALL_INTERESTS.map((interest) => (
                <InterestChip
                  key={interest}
                  label={interest}
                  selected={data.interests.includes(interest)}
                  onPress={() => toggle(data.interests, interest, 'interests')}
                />
              ))}
            </View>
            {errors.interests && <AppText size="xs" color={theme.colors.error} style={{ marginTop: 12 }}>{errors.interests}</AppText>}
          </View>
        )}

        {step === 3 && (
          <View style={styles.form}>
            <View style={styles.field}>
              <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginBottom: 12 }}>RELATIONSHIP INTENTION</AppText>
              <View style={styles.chipsWrap}>
                {INTENTIONS.map((opt) => (
                  <InterestChip key={opt} label={opt.replace(/-/g, ' ')} selected={data.intention === opt} onPress={() => setData((p) => ({ ...p, intention: opt }))} />
                ))}
              </View>
            </View>
            <View style={styles.field}>
              <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginBottom: 12 }}>COMMUNICATION STYLE</AppText>
              <View style={styles.chipsWrap}>
                {COMMUNICATION_STYLES.map((opt) => (
                  <InterestChip key={opt} label={opt} selected={data.communication === opt} onPress={() => setData((p) => ({ ...p, communication: opt }))} />
                ))}
              </View>
            </View>
            <View style={styles.field}>
              <AppText size="sm" weight="semibold" color={theme.colors.textMuted} style={{ marginBottom: 12}}>VALUES (SELECT AT LEAST 2)</AppText>
              <View style={styles.chipsWrap}>
                {VALUE_OPTIONS.map((opt) => (
                  <InterestChip key={opt} label={opt} selected={data.values.includes(opt)} onPress={() => toggle(data.values, opt, 'values')} size="sm" />
                ))}
              </View>
              {errors.values && <AppText size="xs" color={theme.colors.error} style={{ marginTop: 12 }}>{errors.values}</AppText>}
            </View>
          </View>
        )}

        {step === 4 && (
          <View style={styles.form}>
            <View style={[styles.reviewBox, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg }]}>
              <ReviewItem label="Age" value={data.age} />
              <ReviewItem label="City" value={data.city} />
              <ReviewItem label="Pronouns" value={data.pronouns || 'Not specified'} />
              <ReviewItem label="Languages" value={data.languages} />
              <ReviewItem label="Bio" value={data.bio} />
              <ReviewItem label="Interests" value={data.interests.join(', ')} />
              <ReviewItem label="Intention" value={data.intention.replace(/-/g, ' ')} />
              <ReviewItem label="Communication" value={data.communication} />
              <ReviewItem label="Values" value={data.values.join(', ')} />
            </View>
            <AppText size="sm" color={theme.colors.textMuted} style={{ marginTop: 16, lineHeight: 20 }}>
              You can edit all of this later in your profile settings.
            </AppText>
          </View>
        )}

        <AppButton
          label={step === TOTAL_STEPS - 1 ? 'Complete profile' : 'Continue'}
          onPress={handleNext}
          loading={updateProfile.isPending}
          fullWidth
          size="lg"
          style={{ marginTop: 24 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  const { theme } = useTheme();
  return (
    <View style={styles.reviewRow}>
      <AppText size="xs" weight="semibold" color={theme.colors.textMuted}>{label.toUpperCase()}</AppText>
      <AppText size="sm" style={{ marginTop: 2, flex: 1 }}>{value || 'Not provided'}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12, gap: 12 },
  progressTrack: { flex: 1, height: 4 },
  progressFill: { height: 4 },
  form: { marginTop: 24 },
  field: { marginBottom: 20 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  reviewBox: { padding: 20, gap: 14 },
  reviewRow: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(0,0,0,0.06)', paddingBottom: 12 },
});
