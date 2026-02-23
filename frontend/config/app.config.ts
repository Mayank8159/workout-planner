export const APP_CONFIG = {
  // API Configuration
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000',
  API_TIMEOUT: 30000,

  // App Constants
  APP_NAME: 'Workout Planner',
  APP_VERSION: '1.0.0',

  // Colors
  COLORS: {
    primary: '#1f2937',
    secondary: '#3b82f6',
    accent: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    dark_bg: '#111827',
    dark_card: '#1f2937',
    dark_input: '#374151',
  },

  // Screen Names
  SCREENS: {
    DASHBOARD: 'dashboard',
    WORKOUT: 'workout',
    SCANNER: 'scanner',
  },

  // Camera Settings
  CAMERA: {
    QUALITY: 0.8,
    BASE64: true,
    ASPECT_RATIO: '4:3',
  },

  // Validation Rules
  VALIDATION: {
    MIN_WEIGHT: 0,
    MAX_WEIGHT: 1000,
    MIN_SETS: 1,
    MAX_SETS: 100,
    MIN_REPS: 1,
    MAX_REPS: 1000,
    MIN_DURATION: 1,
    MAX_DURATION: 1000,
  },
};

export default APP_CONFIG;
