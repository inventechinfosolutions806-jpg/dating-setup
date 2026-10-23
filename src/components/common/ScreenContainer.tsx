import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';

interface ScreenContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  padded?: boolean;
}

export function ScreenContainer({
  children,
  scroll = true,
  style,
  contentContainerStyle,
  padded = true,
}: ScreenContainerProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const content = (
    <View
      style={[
        {
          flex: scroll ? undefined : 1,
          paddingTop: insets.top + (padded ? theme.spacing[4] : 0),
          paddingHorizontal: padded ? theme.spacing[4] : 0,
          paddingBottom: insets.bottom + (padded ? theme.spacing[4] : 0),
        },
        contentContainerStyle,
      ]}
    >
      {children}
    </View>
  );

  if (scroll) {
    return (
      <ScrollView
        style={[{ backgroundColor: theme.colors.background }, style]}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {content}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }, style]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
