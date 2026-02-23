import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/utils/api';
import { secureStorage } from '@/utils/secureStorage';

export interface User {
  id: string;
  username: string;
  email: string;
  dailyCalorieGoal?: number;
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
        const storedToken = await secureStorage.getToken();
        if (storedToken) {
          // Fetch user data with stored token
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
            workoutStreak: userData.workoutStreak,
            createdAt: userData.createdAt,
          });
          setToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log('No valid token found or token expired, user needs to login');
        await secureStorage.removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Call login endpoint to get token and user data
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      const accessToken = loginResponse.data.access_token;
      const userData = loginResponse.data.user;

      // Store token securely (platform-aware)
      await secureStorage.setToken(accessToken);

      // Set user data from login response (no need for separate /users/me call)
      setUser({
        id: userData.id || userData._id,
        username: userData.username,
        email: userData.email,
        dailyCalorieGoal: userData.dailyCalorieGoal,
        workoutStreak: userData.workoutStreak,
        createdAt: userData.createdAt,
      });
      setToken(accessToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string, dailyCalorieGoal: number = 2000) => {
    try {
      // Call register endpoint - it returns token and user data
      const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
        username,
        email,
        password,
        dailyCalorieGoal,
      });

      const accessToken = registerResponse.data.access_token;
      const userData = registerResponse.data.user;

      // Store token securely (platform-aware)
      await secureStorage.setToken(accessToken);

      // Set user data from register response
      setUser({
        id: userData.id || userData._id,
        username: userData.username,
        email: userData.email,
        dailyCalorieGoal: userData.dailyCalorieGoal,
        workoutStreak: userData.workoutStreak,
        createdAt: userData.createdAt,
      });
      setToken(accessToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await secureStorage.removeToken();
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
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
