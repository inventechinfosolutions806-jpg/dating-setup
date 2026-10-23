import { StyleSheet, View } from 'react-native';
import { AppText, AppHeading } from '../ui/AppText';
import { useTheme } from '@/theme/ThemeProvider';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.textWrap}>
        <AppHeading size="xl">{title}</AppHeading>
        {subtitle && (
          <AppText size="sm" color={theme.colors.textMuted} style={{ marginTop: 4 }}>
            {subtitle}
          </AppText>
        )}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  textWrap: { flex: 1 },
});
