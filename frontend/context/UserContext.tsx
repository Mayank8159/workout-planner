import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/utils/api';
import { secureStorage } from '@/utils/secureStorage';

export interface User {
  id: string;
  username: string;
  email: string;
  dailyCalorieGoal?: number;
  proteinGoal?: number;
  carbsGoal?: number;
  fiberGoal?: number;
  workoutStreak?: number;
  createdAt?: string;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, dailyCalorieGoal?: number) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on app launch
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔍 Checking for stored token...');
        const storedToken = await secureStorage.getToken();
        
        if (storedToken) {
          console.log('✓ Token found, validating...');
          try {
            // Create a shorter timeout for initial validation (10 seconds max)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
              console.log('⏱️ Token validation timeout - clearing token');
              controller.abort();
            }, 10000);
            
            try {
              const response = await axios.get(`${API_BASE_URL}/users/me`, {
                headers: {
                  Authorization: `Bearer ${storedToken}`,
                },
                signal: controller.signal,
                timeout: 10000,
              });
              
              clearTimeout(timeoutId);
              
              const userData = response.data;
              console.log('✓ User authenticated:', userData.username);
              setUser({
                id: userData.id || userData._id,
                username: userData.username,
                email: userData.email,
                dailyCalorieGoal: userData.dailyCalorieGoal,
                proteinGoal: userData.proteinGoal,
                carbsGoal: userData.carbsGoal,
                fiberGoal: userData.fiberGoal,
                workoutStreak: userData.workoutStreak,
                createdAt: userData.createdAt,
              });
              setToken(storedToken);
              setIsAuthenticated(true);
            } catch (axiosError: any) {
              clearTimeout(timeoutId);
              throw axiosError;
            }
          } catch (validateError: any) {
            const errorMsg = validateError?.response?.status || validateError?.code || validateError.message || 'Unknown';
            console.log('❌ Token validation failed:', errorMsg);
            
            // If it's a 401, timeout, network error, or 500 error - clear the token
            if (
              validateError?.response?.status === 401 || 
              validateError?.response?.status === 500 ||
              validateError.name === 'AbortError' ||
              validateError?.code === 'ECONNABORTED' ||
              validateError?.code === 'ERR_NETWORK' ||
              validateError?.message?.includes('timeout')
            ) {
              console.log('🗑️ Clearing invalid/expired/unreachable token');
              try {
                await secureStorage.removeToken();
              } catch (removeError) {
                console.warn('⚠️ Could not remove token:', removeError);
              }
            }
            // Don't re-throw - just continue with unauthenticated state
          }
        } else {
          console.log('ℹ No stored token found');
        }
      } catch (error: any) {
        const errorMsg = error?.message || 'Unknown error';
        console.log('❌ Auth initialization error:', errorMsg);
        // Ensure the app doesn't crash - just log and continue
      } finally {
        // Always set loading to false, even if there was an error
        setIsLoading(false);
        console.log('✓ Auth initialization complete');
      }
    };

    // Initialize auth and prevent unhandled rejections
    let mounted = true;
    initializeAuth()
      .catch((error) => {
        if (mounted) {
          console.error('❌ Critical auth initialization error:', error);
          setIsLoading(false);
        }
      });
    
    // Cleanup on unmount
    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Logging in...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      try {
        // Call login endpoint to get token and user data
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
          email,
          password,
        }, {
          signal: controller.signal,
          timeout: 15000,
        });
        
        clearTimeout(timeoutId);

        const accessToken = loginResponse.data.access_token;
        const userData = loginResponse.data.user;

        console.log('✓ Login successful, storing token...');
        // Store token securely (platform-aware)
        await secureStorage.setToken(accessToken);

        // Set user data from login response (no need for separate /users/me call)
        setUser({
          id: userData.id || userData._id,
          username: userData.username,
          email: userData.email,
          dailyCalorieGoal: userData.dailyCalorieGoal,
          proteinGoal: userData.proteinGoal,
          carbsGoal: userData.carbsGoal,
          fiberGoal: userData.fiberGoal,
          workoutStreak: userData.workoutStreak,
          createdAt: userData.createdAt,
        });
        setToken(accessToken);
        setIsAuthenticated(true);
        console.log('✓ User logged in successfully');
      } catch (axiosError: any) {
        clearTimeout(timeoutId);
        throw axiosError;
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.detail || error?.message || 'Login failed';
      console.error('❌ Login failed:', errorMsg);
      throw new Error(errorMsg);
    }
  };

  const register = async (username: string, email: string, password: string, dailyCalorieGoal: number = 2000) => {
    try {
      console.log('📝 Registering new user...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      try {
        // Call register endpoint - it returns token and user data
        const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
          username,
          email,
          password,
          dailyCalorieGoal,
        }, {
          signal: controller.signal,
          timeout: 15000,
        });
        
        clearTimeout(timeoutId);

        const accessToken = registerResponse.data.access_token;
        const userData = registerResponse.data.user;

        console.log('✓ Registration successful, storing token...');
        // Store token securely (platform-aware)
        await secureStorage.setToken(accessToken);

        // Set user data from register response
        setUser({
          id: userData.id || userData._id,
          username: userData.username,
          email: userData.email,
          dailyCalorieGoal: userData.dailyCalorieGoal,
          proteinGoal: userData.proteinGoal,
          carbsGoal: userData.carbsGoal,
          fiberGoal: userData.fiberGoal,
          workoutStreak: userData.workoutStreak,
          createdAt: userData.createdAt,
        });
        setToken(accessToken);
        setIsAuthenticated(true);
        console.log('✓ User registered and logged in successfully');
      } catch (axiosError: any) {
        clearTimeout(timeoutId);
        throw axiosError;
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.detail || error?.message || 'Registration failed';
      console.error('❌ Registration failed:', errorMsg);
      throw new Error(errorMsg);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Starting logout process...');
      
      // 1. Remove token from secure storage
      await secureStorage.removeToken();
      console.log('✓ Token removed from storage');
      
      // 2. Clear state variables
      console.log('🔄 Clearing auth state...');
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      console.log('✓ Auth state cleared');
      
      // 3. Small delay to ensure state updates propagate
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log('✓ Logout complete - state will trigger navigation');
      
    } catch (error) {
      console.error('❌ Logout failed:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const storedToken = await secureStorage.getToken();
      if (storedToken) {
        const response = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        
        const userData = response.data;
        setUser({
          id: userData.id || userData._id,
          username: userData.username,
          email: userData.email,
          dailyCalorieGoal: userData.dailyCalorieGoal,
          proteinGoal: userData.proteinGoal,
          carbsGoal: userData.carbsGoal,
          fiberGoal: userData.fiberGoal,
          workoutStreak: userData.workoutStreak,
          createdAt: userData.createdAt,
        });
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        setUser,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
