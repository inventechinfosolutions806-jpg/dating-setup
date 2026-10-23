import { StyleSheet, View } from 'react-native';
import { AppText } from '../ui/AppText';
import { useTheme } from '@/theme/ThemeProvider';

interface SettingsRowProps {
  label: string;
  value?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  destructive?: boolean;
  rightIcon?: React.ReactNode;
}

import { Pressable } from 'react-native';

export function SettingsRow({ label, value, icon, onPress, destructive = false, rightIcon }: SettingsRowProps) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: theme.colors.surface,
          opacity: pressed ? 0.7 : 1,
          paddingHorizontal: theme.spacing[4],
          paddingVertical: theme.spacing[4],
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      {icon && <View style={styles.iconWrap}>{icon}</View>}
      <View style={styles.textWrap}>
        <AppText size="md" color={destructive ? theme.colors.error : theme.colors.text}>
          {label}
        </AppText>
        {value && (
          <AppText size="sm" color={theme.colors.textMuted} style={{ marginTop: 2 }}>
            {value}
          </AppText>
        )}
      </View>
      {rightIcon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: { width: 32, alignItems: 'center' },
  textWrap: { flex: 1 },
});
