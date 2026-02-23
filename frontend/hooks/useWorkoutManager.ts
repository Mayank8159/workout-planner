import { useState, useCallback } from 'react';
import { WorkoutEntry } from '@/types';

export const useWorkoutManager = () => {
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);

  const addWorkout = useCallback((workout: Omit<WorkoutEntry, 'id'>) => {
    const newWorkout: WorkoutEntry = {
      ...workout,
      id: Date.now().toString(),
    };
    setWorkouts((prev) => [newWorkout, ...prev]);
    return newWorkout;
  }, []);

  const deleteWorkout = useCallback((id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const updateWorkout = useCallback((id: string, updates: Partial<WorkoutEntry>) => {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates } : w))
    );
  }, []);

  const clearWorkouts = useCallback(() => {
    setWorkouts([]);
  }, []);

  const getTotalVolume = useCallback(() => {
    return workouts.reduce((acc, w) => acc + w.sets * w.reps * w.weight, 0);
  }, [workouts]);

  const getTotalDuration = useCallback(() => {
    return workouts.reduce((acc, w) => acc + w.duration, 0);
  }, [workouts]);

  return {
    workouts,
    addWorkout,
    deleteWorkout,
    updateWorkout,
    clearWorkouts,
    getTotalVolume,
    getTotalDuration,
  };
};

export default useWorkoutManager;
