import axios, { AxiosInstance } from 'axios';
import { secureStorage } from './secureStorage';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await secureStorage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Failed to get token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const userAPI = {
  getProfile: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  updateProfile: async (userData: any) => {
    const response = await apiClient.put('/users/me', userData);
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await apiClient.post('/users/login', { email, password });
    return response.data;
  },

  register: async (username: string, email: string, password: string) => {
    const response = await apiClient.post('/users/register', {
      username,
      email,
      password,
    });
    return response.data;
  },
};

export const dataAPI = {
  getDailyData: async (date: string) => {
    const response = await apiClient.get(`/data/${date}`);
    return response.data;
  },

  getWorkouts: async (date: string) => {
    const response = await apiClient.get(`/workouts/date/${date}`);
    return response.data;
  },

  addWorkout: async (workoutData: any) => {
    const response = await apiClient.post('/workouts', workoutData);
    return response.data;
  },

  deleteWorkout: async (workoutId: string) => {
    const response = await apiClient.delete(`/workouts/${workoutId}`);
    return response.data;
  },
};

export const nutritionAPI = {
  getDailyNutrition: async (date: string) => {
    const response = await apiClient.get(`/nutrition/date/${date}`);
    return response.data;
  },

  addFoodItem: async (foodData: any) => {
    const response = await apiClient.post('/nutrition/food', foodData);
    return response.data;
  },

  deleteFoodItem: async (foodId: string) => {
    const response = await apiClient.delete(`/nutrition/food/${foodId}`);
    return response.data;
  },

  logMealFromPrediction: async (mealData: {
    foodItem: string;
    calories: number;
    confidence: number;
    date: string;
  }) => {
    const response = await apiClient.post('/nutrition/meal-prediction', mealData);
    return response.data;
  },
};

export const calorieDetectionAPI = {
  predictMeal: async (imageUri: string) => {
    try {
      const formData = new FormData();
      const response = await fetch(imageUri);
      const blob = await response.blob();
      formData.append('image', blob as any, 'photo.jpg');

      const result = await apiClient.post('/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return result.data;
    } catch (error) {
      throw error;
    }
  },
};

export default apiClient;
