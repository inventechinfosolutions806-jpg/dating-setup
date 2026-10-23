import { useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ArrowLeft, MoreHorizontal, Flag, Ban, Bookmark, Send } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { AppText, AppHeading } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { IconButton } from '@/components/ui/IconButton';
import { InterestChip } from '@/components/ui/InterestChip';
import { CompatibilityReason } from '@/components/ui/CompatibilityReason';
import { AppInput } from '@/components/ui/AppInput';
import { useTheme } from '@/theme/ThemeProvider';
import { useCandidate } from '@/features/discovery/hooks/useDiscover';
import { usePassCandidate } from '@/features/discovery/hooks/useDiscover';
import { useSendIntroduction } from '@/features/introductions/hooks/useIntroductions';
import { useBlockUser } from '@/features/safety/hooks/useSafety';

export default function CandidateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { data: candidate, isPending, isError, refetch } = useCandidate(id);
  const passMutation = usePassCandidate();
  const sendIntroMutation = useSendIntroduction();
  const blockMutation = useBlockUser();

  const [showIntroForm, setShowIntroForm] = useState(false);
  const [introMessage, setIntroMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handlePass = useCallback(() => {
    if (!id) return;
    passMutation.mutate(id, {
      onSuccess: () => {
        if (router.canGoBack()) router.back();
        else router.replace('/(tabs)');
      },
    });
  }, [id, passMutation, router]);

  const handleSendIntro = useCallback(() => {
    if (!candidate || !introMessage.trim()) return;
    sendIntroMutation.mutate(
      { toUserId: candidate.id, message: introMessage.trim() },
      {
        onSuccess: () => {
          setShowIntroForm(false);
          setIntroMessage('');
          Alert.alert('Introduction sent', `${candidate.displayName} will see your message soon.`);
        },
      },
    );
  }, [candidate, introMessage, sendIntroMutation]);

  const handleBlock = useCallback(() => {
    if (!candidate) return;
    Alert.alert(
      'Block ' + candidate.displayName + '?',
      'They will not be able to contact you or see your profile.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: () => {
            blockMutation.mutate(
              { userId: candidate.id },
              { onSuccess: () => router.back() },
            );
          },
        },
      ],
    );
  }, [candidate, blockMutation, router]);

  if (isPending) {
    return (
      <ScreenContainer scroll={false}>
        <LoadingSkeleton count={2} />
      </ScreenContainer>
    );
  }
  if (isError || !candidate) {
    return (
      <ScreenContainer scroll={false}>
        <ErrorState onRetry={() => void refetch()} />
      </ScreenContainer>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={[styles.imageWrap, { backgroundColor: theme.colors.skeleton }]}>
          <Image source={{ uri: candidate.photoUrl }} style={styles.heroImage} />
          <View style={styles.topBar}>
            <IconButton
              onPress={() => router.back()}
              icon={<ArrowLeft size={22} color="#FFFFFF" strokeWidth={2} />}
              variant="ghost"
              style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
            />
            <IconButton
              onPress={() => setMenuOpen((v) => !v)}
              icon={<MoreHorizontal size={22} color="#FFFFFF" strokeWidth={2} />}
              variant="ghost"
              style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
            />
          </View>
          {menuOpen && (
            <View style={[styles.menu, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.md }]}>
              <Pressable
                onPress={() => {
                  setMenuOpen(false);
                  router.push(`/report-user/${candidate.id}`);
                }}
                style={styles.menuItem}
              >
                <Flag size={18} color={theme.colors.error} strokeWidth={2} />
                <AppText size="sm" color={theme.colors.error}>Report</AppText>
              </Pressable>
              <Pressable onPress={() => { setMenuOpen(false); handleBlock(); }} style={styles.menuItem}>
                <Ban size={18} color={theme.colors.error} strokeWidth={2} />
                <AppText size="sm" color={theme.colors.error}>Block</AppText>
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.nameRow}>
            <AppHeading size="3xl">
              {candidate.displayName}, {candidate.age}
            </AppHeading>
          </View>
          <AppText size="md" color={theme.colors.textMuted} style={{ marginTop: 4 }}>
            {candidate.city}, {candidate.region}
          </AppText>
          {candidate.pronouns && (
            <AppText size="sm" color={theme.colors.textMuted} style={{ marginTop: 2 }}>
              {candidate.pronouns}
            </AppText>
          )}

          <View style={styles.section}>
            <AppHeading size="lg">About</AppHeading>
            <AppText size="md" style={{ marginTop: 8, lineHeight: 24 }}>
              {candidate.bio}
            </AppText>
          </View>

          <View style={styles.section}>
            <AppHeading size="lg">Interests</AppHeading>
            <View style={styles.chipsWrap}>
              {candidate.interests.map((interest) => (
                <InterestChip
                  key={interest}
                  label={interest}
                  selected={candidate.sharedInterests.includes(interest)}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <AppHeading size="lg">Relationship intention</AppHeading>
            <AppText size="md" color={theme.colors.text} style={{ marginTop: 8 }}>
              {candidate.relationshipIntent === 'friendship-first'
                ? 'Friendship first, open to seeing where things go naturally.'
                : 'Open to romance, while valuing a foundation of friendship.'}
            </AppText>
          </View>

          <View style={styles.section}>
            <AppHeading size="lg">Values & lifestyle</AppHeading>
            <View style={styles.chipsWrap}>
              {candidate.values.map((v) => (
                <InterestChip key={v} label={v} size="sm" />
              ))}
              {candidate.lifestyle.map((l) => (
                <InterestChip key={l} label={l.replace(/-/g, ' ')} size="sm" />
              ))}
            </View>
          </View>

          {candidate.sharedInterests.length > 0 && (
            <View style={styles.section}>
              <AppHeading size="lg">Shared with you</AppHeading>
              <View style={styles.chipsWrap}>
                {candidate.sharedInterests.map((si) => (
                  <InterestChip key={si} label={si} selected size="sm" />
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <AppHeading size="lg">Why you may connect</AppHeading>
            <View style={{ gap: 12, marginTop: 12 }}>
              {candidate.compatibilityReasons.map((reason, i) => (
                <CompatibilityReason key={i} reason={reason} index={i} />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <AppHeading size="lg">Conversation starters</AppHeading>
            <View style={{ gap: 8, marginTop: 12 }}>
              {candidate.conversationStarters.map((starter, i) => (
                <View
                  key={i}
                  style={[
                    styles.starterCard,
                    { backgroundColor: theme.colors.surface, borderRadius: theme.radii.md, borderColor: theme.colors.border },
                  ]}
                >
                  <AppText size="sm" color={theme.colors.text} style={{ lineHeight: 20 }}>
                    {starter}
                  </AppText>
                </View>
              ))}
            </View>
          </View>

          {showIntroForm && (
            <View style={styles.section}>
              <AppHeading size="lg">Send an introduction</AppHeading>
              <AppText size="sm" color={theme.colors.textMuted} style={{ marginTop: 4, marginBottom: 12 }}>
                Write a short message. Be genuine and specific.
              </AppText>
              <AppInput
                value={introMessage}
                onChangeText={setIntroMessage}
                placeholder="Hi! I noticed we both love..."
                multiline
                numberOfLines={3}
                style={{ minHeight: 80, textAlignVertical: 'top' }}
              />
              <View style={styles.introActions}>
                <AppButton label="Cancel" variant="ghost" onPress={() => setShowIntroForm(false)} />
                <AppButton
                  label="Send"
                  onPress={handleSendIntro}
                  loading={sendIntroMutation.isPending}
                  disabled={!introMessage.trim()}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {!showIntroForm && (
        <View
          style={[
            styles.bottomBar,
            {
              backgroundColor: theme.colors.surface,
              borderTopColor: theme.colors.border,
            },
          ]}
        >
          <AppButton
            label="Pass"
            variant="outline"
            onPress={handlePass}
            loading={passMutation.isPending}
            style={{ flex: 1 }}
            fullWidth
          />
          <AppButton
            label="Start with a question"
            onPress={() => setShowIntroForm(true)}
            style={{ flex: 1.5 }}
            fullWidth
            leftIcon={<Send size={16} color="#FFFFFF" strokeWidth={2} />}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageWrap: { position: 'relative' },
  heroImage: { width: '100%', height: 360, resizeMode: 'cover' },
  topBar: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menu: {
    position: 'absolute',
    top: 100,
    right: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 12 },
  content: { padding: 20, paddingBottom: 100 },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  section: { marginTop: 28 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  starterCard: { padding: 14, borderWidth: 1 },
  introActions: { flexDirection: 'row', gap: 12, marginTop: 12, justifyContent: 'flex-end' },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 36,
    borderTopWidth: 1,
  },
});
