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
    if (isLoading) {
      console.log('⏳ Auth still loading...');
      return;
    }

    console.log('🔐 Auth check - isAuthenticated:', isAuthenticated, 'route:', segments[0]);

    // Determine if user is trying to access protected vs public routes
    const inAuthGroup = segments[0] === '(tabs)';
    const inAuthScreen = segments[0] === 'login' || segments[0] === 'signup';
    const isOnPublicRoute = !inAuthGroup;

    if (!isAuthenticated && inAuthGroup) {
      // User is NOT authenticated but trying to access protected routes
      console.log('❌ Not authenticated, redirecting to login...');
      router.replace('/login');
    } else if (!isAuthenticated && !inAuthScreen && isOnPublicRoute) {
      // Not authenticated and not on auth screens - go to login
      console.log('⚠️ Unprotected route accessed without auth, redirecting to login...');
      router.replace('/login');
    } else if (isAuthenticated && inAuthScreen) {
      // IS authenticated but on login/signup screen
      console.log('✓ Authenticated on login screen, redirecting to dashboard...');
      router.replace('/(tabs)/dashboard');
    } else {
      console.log('✓ Auth state valid for current route');
    }
  }, [isAuthenticated, isLoading, segments]);

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
