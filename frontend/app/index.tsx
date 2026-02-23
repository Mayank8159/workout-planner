import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import SplashScreen from '@/components/SplashScreen';
import { View, ActivityIndicator } from 'react-native';

export default function Root() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useUser();

  useEffect(() => {
    // Add a small delay to ensure auth state is properly initialized
    const timer = setTimeout(() => {
      if (!isLoading) {
        if (isAuthenticated) {
          console.log('✓ User authenticated, redirecting to dashboard');
          router.replace('/(tabs)/dashboard');
        } else {
          console.log('✗ User not authenticated, redirecting to login');
          router.replace('/login');
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, router]);

  // Show loading indicator while checking auth
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
      {isLoading ? (
        <SplashScreen />
      ) : (
        <ActivityIndicator size="large" color="#3b82f6" />
      )}
    </View>
  );
}

