import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface AppInputProps extends TextInputProps {
  error?: string;
  leftIcon?: React.ReactNode;
}

export function AppInput({ error, leftIcon, style, ...rest }: AppInputProps) {
  const { theme } = useTheme();
  if (leftIcon) {
    return (
      <View
        style={[
          inputStyles.wrapper,
          {
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: error ? theme.colors.error : theme.colors.border,
            borderRadius: theme.radii.md,
          },
        ]}
      >
        <View style={inputStyles.iconWrap}>{leftIcon}</View>
        <TextInput
          style={[
            {
              flex: 1,
              paddingVertical: 14,
              paddingRight: 16,
              fontSize: theme.typography.sizes.md,
              color: theme.colors.text,
              fontFamily: theme.typography.fontFamily,
            },
            style,
          ]}
          placeholderTextColor={theme.colors.textMuted}
          {...rest}
        />
      </View>
    );
  }
  return (
    <TextInput
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: error ? theme.colors.error : theme.colors.border,
          borderRadius: theme.radii.md,
          paddingHorizontal: 16,
          paddingVertical: 14,
          fontSize: theme.typography.sizes.md,
          color: theme.colors.text,
          fontFamily: theme.typography.fontFamily,
        },
        style,
      ]}
      placeholderTextColor={theme.colors.textMuted}
      {...rest}
    />
  );
}

export const inputStyles = StyleSheet.create({
  label: { marginBottom: 6 },
  wrapper: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { paddingLeft: 14 },
});
