import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'userToken';

// Platform-specific storage implementation
const isWeb = Platform.OS === 'web';

export const secureStorage = {
  async setToken(token: string): Promise<void> {
    try {
      if (isWeb) {
        // Use localStorage for web
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(TOKEN_KEY, token);
        }
      } else {
        // Use SecureStore for native
        await SecureStore.setItemAsync(TOKEN_KEY, token);
      }
    } catch (error) {
      console.error('Failed to store token:', error);
      throw error;
    }
  },

  async getToken(): Promise<string | null> {
    try {
      if (isWeb) {
        // Use localStorage for web
        if (typeof window !== 'undefined') {
          return window.localStorage.getItem(TOKEN_KEY);
        }
        return null;
      } else {
        // Use SecureStore for native
        return await SecureStore.getItemAsync(TOKEN_KEY);
      }
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  },

  async removeToken(): Promise<void> {
    try {
      if (isWeb) {
        // Use localStorage for web
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(TOKEN_KEY);
        }
      } else {
        // Use SecureStore for native
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
    } catch (error) {
      console.error('Failed to remove token:', error);
      throw error;
    }
  },

  async clearAllData(): Promise<void> {
    try {
      if (isWeb) {
        // Use localStorage for web
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(TOKEN_KEY);
        }
      } else {
        // Use SecureStore for native
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw error;
    }
  },
};
