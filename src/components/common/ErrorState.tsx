import { StyleSheet, View } from 'react-native';
import { AppText } from '../ui/AppText';
import { AppButton } from '../ui/AppButton';
import { useTheme } from '@/theme/ThemeProvider';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Something went wrong', onRetry }: ErrorStateProps) {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      <AppText size="xl" weight="semibold" align="center" style={{ marginBottom: 8 }}>
        {message}
      </AppText>
      <AppText size="md" color={theme.colors.textMuted} align="center" style={{ marginBottom: 24, paddingHorizontal: 32 }}>
        Please try again in a moment.
      </AppText>
      {onRetry && <AppButton label="Retry" onPress={onRetry} variant="outline" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
});
