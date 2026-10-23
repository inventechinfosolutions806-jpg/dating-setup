import { Image, StyleSheet, type ImageStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface ProfileAvatarProps {
  uri: string;
  size?: number;
  style?: ImageStyle;
}

export function ProfileAvatar({ uri, size = 48, style }: ProfileAvatarProps) {
  const { theme } = useTheme();
  return (
    <Image
      source={{ uri }}
      style={[
        {
          width: size,
          height: size,
          borderRadius: theme.radii.full,
          backgroundColor: theme.colors.skeleton,
        },
        style,
      ]}
    />
  );
}

export const avatarStyles = StyleSheet.create({
  bordered: { borderWidth: 2 },
});
