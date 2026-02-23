import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import SplashScreen from '@/components/SplashScreen';

export default function Root() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useUser();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/(tabs)/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [isLoading, isAuthenticated, router]);

  // Show splash while redirecting
  if (isLoading) {
    return <SplashScreen />;
  }

  return null;
}
