import axios, { AxiosInstance } from 'axios';
import { secureStorage } from './secureStorage';

export const API_BASE_URL = 'https://workout-planner-b8in.onrender.com';

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
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (username: string, email: string, password: string) => {
    const response = await apiClient.post('/auth/register', {
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
    const response = await apiClient.get(`/data/${date}`);
    return response.data?.workouts || [];
  },

  addWorkout: async (workoutData: any) => {
    const response = await apiClient.post('/workout/', workoutData);
    return response.data;
  },

  deleteWorkout: async (workoutId: string) => {
    const response = await apiClient.delete(`/workouts/${workoutId}`);
    return response.data;
  },

  updateUserSettings: async (settingsData: {
    username?: string;
    dailyCalorieGoal?: number;
    proteinGoal?: number;
    carbsGoal?: number;
    fiberGoal?: number;
  }) => {
    const response = await apiClient.put('/users/settings', settingsData);
    return response.data;
  },
};

export const nutritionAPI = {
  getDailyNutrition: async (date: string) => {
    const response = await apiClient.get(`/data/${date}`);
    return response.data?.nutrition || {
      total_calories: 0,
      total_protein: 0,
      total_carbs: 0,
      total_fat: 0,
      total_fiber: 0,
      items: [],
    };
  },

  addFoodItem: async (foodData: any) => {
    // Food items are added through scan endpoint
    const response = await apiClient.post('/scan', { food_item: foodData.name, calories: foodData.calories });
    return response.data;
  },

  deleteFoodItem: async (foodId: string) => {
    // Backend doesn't have delete endpoint yet, mock response
    return { success: true };
  },

  logMealFromPrediction: async (mealData: {
    foodItem: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    confidence: number;
    date: string;
  }) => {
    const response = await apiClient.post('/scan', {
      food_item: mealData.foodItem,
      calories: mealData.calories,
      protein: mealData.protein,
      carbs: mealData.carbs,
      fat: mealData.fat,
      fiber: mealData.fiber,
      confidence: mealData.confidence,
    });
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

      const result = await apiClient.post('/scan', formData, {
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
