import { StyleSheet, View } from 'react-native';
import { AppText } from '../ui/AppText';
import { useTheme } from '@/theme/ThemeProvider';

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ title, message, icon, action }: EmptyStateProps) {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconWrap}>{icon}</View>}
      <AppText size="xl" weight="semibold" align="center" style={{ marginBottom: 8 }}>
        {title}
      </AppText>
      {message && (
        <AppText
          size="md"
          color={theme.colors.textMuted}
          align="center"
          style={{ marginBottom: 24, paddingHorizontal: 32 }}
        >
          {message}
        </AppText>
      )}
      {action}
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
  iconWrap: { marginBottom: 16 },
});
