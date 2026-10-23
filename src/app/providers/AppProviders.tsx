import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { queryClient } from '@/app/query-client';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuthSession } from '@/features/auth/store/auth-session.store';
import { authService } from '@/features/auth/services/auth.service';
import { useRouter, useSegments, SplashScreen } from 'expo-router';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { theme, mode } = useTheme();
  const { user, isRestoring, setUser, setRestoring } = useAuthSession();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    (async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          setRestoring(false);
        }
      } catch {
        setRestoring(false);
      }
    })();
  }, [setUser, setRestoring]);

  useEffect(() => {
    if (isRestoring) return;

    const inAuthGroup = segments[0] === 'auth';
    const inOnboarding = segments[0] === 'onboarding';
    const inNotFound = segments[0] === '+not-found' || segments[0] === undefined;

    if (!user && !inAuthGroup) {
      router.replace('/auth/welcome');
    } else if (user && !user.onboarded && !inOnboarding && !inAuthGroup) {
      router.replace('/onboarding');
    } else if (user && user.onboarded && (inAuthGroup || inOnboarding || inNotFound)) {
      router.replace('/(tabs)');
    }

    if (!isRestoring) {
      SplashScreen.hideAsync();
    }
  }, [user, isRestoring, segments, router]);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
          {children}
          {isRestoring && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.colors.background,
              }}
            >
              <ActivityIndicator size="large" color={theme.colors.accent} />
            </View>
          )}
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export { AuthGate };
