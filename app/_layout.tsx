import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SplashScreen } from 'expo-router';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { AuthGate } from '@/app/providers/AppProviders';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
      <AuthGate>
        <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)">
          <Stack.Screen name="auth/welcome" />
          <Stack.Screen name="auth/signin" />
          <Stack.Screen name="auth/signup" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="candidate/[id]" />
          <Stack.Screen name="chat/[conversationId]" />
          <Stack.Screen name="activity/[id]" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="edit-profile" />
          <Stack.Screen name="edit-preferences" />
          <Stack.Screen name="privacy-settings" />
          <Stack.Screen name="safety-center" />
          <Stack.Screen name="blocked-users" />
          <Stack.Screen name="report-user/[userId]" />
          <Stack.Screen name="subscription-plans" />
          <Stack.Screen name="subscription-status" />
          <Stack.Screen name="account-settings" />
          <Stack.Screen name="data-export" />
          <Stack.Screen name="connection/[id]" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </AuthGate>
    </ThemeProvider>
  );
}
