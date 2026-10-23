import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '@/theme/ThemeProvider';
import type { ConnectionStatus } from '@/domain/models/connection';

interface ConnectionStatusBadgeProps {
  status: ConnectionStatus;
}

export function ConnectionStatusBadge({ status }: ConnectionStatusBadgeProps) {
  const { theme } = useTheme();
  const config: Record<ConnectionStatus, { bg: string; text: string; label: string }> = {
    active: { bg: theme.colors.success + '20', text: theme.colors.success, label: 'Active' },
    pending: { bg: theme.colors.warning + '20', text: theme.colors.warning, label: 'Pending' },
    archived: { bg: theme.colors.border, text: theme.colors.textMuted, label: 'Archived' },
    ended: { bg: theme.colors.error + '20', text: theme.colors.error, label: 'Ended' },
  };
  const c = config[status];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg, borderRadius: theme.radii.full }]}>
      <AppText size="xs" weight="medium" color={c.text}>
        {c.label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingVertical: 4, paddingHorizontal: 10 },
});
