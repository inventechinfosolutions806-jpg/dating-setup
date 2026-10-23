import { StyleSheet, View } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { AppText } from './AppText';
import { useTheme } from '@/theme/ThemeProvider';

interface CompatibilityReasonProps {
  reason: string;
  index?: number;
}

export function CompatibilityReason({ reason, index = 0 }: CompatibilityReasonProps) {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: theme.colors.accent + '20',
            borderRadius: theme.radii.full,
          },
        ]}
      >
        <Sparkles size={16} color={theme.colors.accent} />
      </View>
      <AppText size="sm" style={{ flex: 1, lineHeight: 22 }}>
        {reason}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  iconWrap: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
});
