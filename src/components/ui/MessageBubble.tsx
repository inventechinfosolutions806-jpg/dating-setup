import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '@/theme/ThemeProvider';
import type { Message } from '@/domain/models/message';
import { dayjs } from '@/shared/lib/dayjs';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showTimestamp?: boolean;
}

export function MessageBubble({ message, isOwn, showTimestamp = false }: MessageBubbleProps) {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      {showTimestamp && (
        <View style={styles.timestampWrap}>
          <AppText size="xs" color={theme.colors.textMuted} align="center">
            {dayjs(message.createdAt).format('MMM D, h:mm A')}
          </AppText>
        </View>
      )}
      <View style={[styles.bubbleWrap, { alignItems: isOwn ? 'flex-end' : 'flex-start' }]}>
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: isOwn ? theme.colors.primary : theme.colors.surface,
              borderRadius: theme.radii.lg,
              borderWidth: isOwn ? 0 : 1,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <AppText
            size="sm"
            color={isOwn ? theme.colors.textInverse : theme.colors.text}
            style={{ lineHeight: 22 }}
          >
            {message.text}
          </AppText>
        </View>
        {message.status === 'failed' && (
          <AppText size="xs" color={theme.colors.error} style={{ marginTop: 4 }}>
            Failed to send
          </AppText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, marginVertical: 3 },
  timestampWrap: { alignItems: 'center', paddingVertical: 12 },
  bubbleWrap: { width: '100%' },
  bubble: { maxWidth: '78%', paddingHorizontal: 16, paddingVertical: 12 },
});
