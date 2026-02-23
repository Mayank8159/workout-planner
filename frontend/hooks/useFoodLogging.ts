import { useState, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { dataAPI, nutritionAPI } from '@/utils/api';

export interface WorkoutEntry {
  id: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  duration: number;
  date: string;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  date: string;
}

interface UseFoodLoggingReturn {
  addingFood: boolean;
  addingWorkout: boolean;
  addFoodItem: (foodData: any) => Promise<FoodItem>;
  addWorkoutEntry: (workoutData: any) => Promise<WorkoutEntry>;
  deleteFoodItem: (foodId: string) => Promise<void>;
  deleteWorkoutEntry: (workoutId: string) => Promise<void>;
  logMealFromPrediction: (mealData: any) => Promise<FoodItem>;
}

export const useFoodLogging = (): UseFoodLoggingReturn => {
  const { user } = useUser();
  const [addingFood, setAddingFood] = useState(false);
  const [addingWorkout, setAddingWorkout] = useState(false);

  const addFoodItem = useCallback(
    async (foodData: any) => {
      if (!user?.id) throw new Error('User not authenticated');

      setAddingFood(true);
      try {
        // Optimistic update - create local ID immediately
        const optimisticItem: FoodItem = {
          id: `temp_${Date.now()}`,
          name: foodData.name,
          calories: foodData.calories,
          date: foodData.date || new Date().toISOString(),
        };

        // Send to server asynchronously
        const result = await nutritionAPI.addFoodItem({
          ...foodData,
          userId: user.id,
        });

        return result;
      } finally {
        setAddingFood(false);
      }
    },
    [user?.id]
  );

  const addWorkoutEntry = useCallback(
    async (workoutData: any) => {
      if (!user?.id) throw new Error('User not authenticated');

      setAddingWorkout(true);
      try {
        // Optimistic update
        const optimisticWorkout: WorkoutEntry = {
          id: `temp_${Date.now()}`,
          ...workoutData,
          date: workoutData.date || new Date().toISOString(),
        };

        // Send to server
        const result = await dataAPI.addWorkout({
          ...workoutData,
          userId: user.id,
        });

        return result;
      } finally {
        setAddingWorkout(false);
      }
    },
    [user?.id]
  );

  const deleteFoodItem = useCallback(async (foodId: string) => {
    try {
      await nutritionAPI.deleteFoodItem(foodId);
    } catch (error) {
      console.error('Failed to delete food item:', error);
      throw error;
    }
  }, []);

  const deleteWorkoutEntry = useCallback(async (workoutId: string) => {
    try {
      await dataAPI.deleteWorkout(workoutId);
    } catch (error) {
      console.error('Failed to delete workout:', error);
      throw error;
    }
  }, []);

  const logMealFromPrediction = useCallback(
    async (mealData: any) => {
      if (!user?.id) throw new Error('User not authenticated');

      setAddingFood(true);
      try {
        // Optimistic update
        const optimisticItem: FoodItem = {
          id: `temp_${Date.now()}`,
          name: mealData.foodItem,
          calories: mealData.calories,
          date: mealData.date || new Date().toISOString(),
        };

        // Send to server
        const result = await nutritionAPI.logMealFromPrediction({
          ...mealData,
          userId: user.id,
        });

        return result;
      } finally {
        setAddingFood(false);
      }
    },
    [user?.id]
  );

  return {
    addingFood,
    addingWorkout,
    addFoodItem,
    addWorkoutEntry,
    deleteFoodItem,
    deleteWorkoutEntry,
    logMealFromPrediction,
  };
};
