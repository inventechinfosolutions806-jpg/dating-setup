import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface InterestChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  size?: 'sm' | 'md';
}

export function InterestChip({ label, selected = false, onPress, size = 'md' }: InterestChipProps) {
  const { theme } = useTheme();
  const fontSize = size === 'sm' ? theme.typography.sizes.xs : theme.typography.sizes.sm;
  const paddingV = size === 'sm' ? 4 : 8;
  const paddingH = size === 'sm' ? 8 : 14;

  const content = (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.colors.accent : theme.colors.surface,
          borderWidth: 1,
          borderColor: selected ? theme.colors.accent : theme.colors.border,
          borderRadius: theme.radii.full,
          paddingVertical: paddingV,
          paddingHorizontal: paddingH,
        },
      ]}
    >
      <Text
        style={{
          fontSize,
          fontWeight: '500',
          color: selected ? '#FFFFFF' : theme.colors.text,
        }}
      >
        {label}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} disabled={false}>
        {content}
      </Pressable>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  chip: { alignItems: 'center', justifyContent: 'center' },
});
