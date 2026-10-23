import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface IconButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  size?: number;
  variant?: 'default' | 'ghost' | 'outline';
  disabled?: boolean;
  style?: ViewStyle;
}

export function IconButton({
  onPress,
  icon,
  variant = 'default',
  disabled = false,
  style,
}: IconButtonProps) {
  const { theme } = useTheme();

  const bgMap = {
    default: theme.colors.surface,
    ghost: 'transparent',
    outline: 'transparent',
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: bgMap[variant],
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderColor: variant === 'outline' ? theme.colors.borderDark : 'transparent',
          borderRadius: theme.radii.full,
          opacity: pressed ? 0.7 : disabled ? 0.4 : 1,
        },
        style,
      ]}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
