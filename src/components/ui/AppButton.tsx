import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '@/theme/ThemeProvider';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  style?: ViewStyle;
}

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  style,
}: AppButtonProps) {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;

  const bgMap: Record<ButtonVariant, string> = {
    primary: theme.colors.primary,
    secondary: theme.colors.accent,
    outline: 'transparent',
    ghost: 'transparent',
    danger: theme.colors.error,
  };

  const textMap: Record<ButtonVariant, string> = {
    primary: theme.colors.textInverse,
    secondary: '#FFFFFF',
    outline: theme.colors.primary,
    ghost: theme.colors.primary,
    danger: '#FFFFFF',
  };

  const sizePadding: Record<ButtonSize, { v: number; h: number; fs: keyof typeof theme.typography.sizes }> = {
    sm: { v: 8, h: 16, fs: 'sm' },
    md: { v: 14, h: 24, fs: 'md' },
    lg: { v: 18, h: 32, fs: 'lg' },
  };

  const sp = sizePadding[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: bgMap[variant],
          paddingVertical: sp.v,
          paddingHorizontal: sp.h,
          borderRadius: theme.radii.md,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderColor: variant === 'outline' ? theme.colors.borderDark : 'transparent',
          opacity: pressed ? 0.85 : isDisabled ? 0.5 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textMap[variant]} size="small" />
      ) : (
        <>
          {leftIcon}
          <AppText
            size={sp.fs}
            weight="semibold"
            color={textMap[variant]}
            align="center"
          >
            {label}
          </AppText>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 48,
  },
});
