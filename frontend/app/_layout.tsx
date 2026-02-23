import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../globals.css';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { UserProvider, useUser } from '@/context/UserContext';
import SplashScreen from '@/components/SplashScreen';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const { isLoading, isAuthenticated } = useUser();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';
    const inAuthScreen = segments[0] === 'login' || segments[0] === 'signup';

    if (!isAuthenticated && inAuthGroup) {
      // Redirect to login if not authenticated and trying to access protected routes
      router.replace('/login');
    } else if (isAuthenticated && inAuthScreen) {
      // Redirect to main app if authenticated and on login/signup screen
      router.replace('/(tabs)/dashboard');
    }
  }, [isAuthenticated, isLoading]);

  // Show splash screen while initializing
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <UserProvider>
      <RootLayoutContent />
    </UserProvider>
  );
}
