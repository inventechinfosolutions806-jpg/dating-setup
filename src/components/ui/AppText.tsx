import { StyleSheet, Text, type TextProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import type { FontSize, FontWeight } from '@/theme/typography';

interface AppTextProps extends TextProps {
  size?: FontSize;
  weight?: FontWeight;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

export function AppText({
  size = 'md',
  weight = 'regular',
  color,
  align = 'left',
  style,
  children,
  ...rest
}: AppTextProps) {
  const { theme } = useTheme();
  const textColor = color ?? theme.colors.text;
  return (
    <Text
      style={[
        {
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.sizes[size],
          fontWeight: theme.typography.weights[weight],
          lineHeight: theme.typography.sizes[size] * theme.typography.lineHeights.normal,
          color: textColor,
          textAlign: align,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

export function AppHeading({
  size = 'xl',
  weight = 'bold',
  color,
  align = 'left',
  style,
  children,
  ...rest
}: AppTextProps) {
  const { theme } = useTheme();
  const textColor = color ?? theme.colors.text;
  return (
    <Text
      style={[
        {
          fontFamily: theme.typography.fontFamilyHeading,
          fontSize: theme.typography.sizes[size],
          fontWeight: theme.typography.weights[weight],
          lineHeight: theme.typography.sizes[size] * theme.typography.lineHeights.tight,
          color: textColor,
          textAlign: align,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

export const textStyles = StyleSheet.create({
  link: { textDecorationLine: 'underline' },
});
