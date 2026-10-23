import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export function LoadingSkeleton({ count = 3 }: { count?: number }) {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.skeleton,
              borderRadius: theme.radii.lg,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16, paddingVertical: 16 },
  card: { width: '100%', height: 200 },
});
