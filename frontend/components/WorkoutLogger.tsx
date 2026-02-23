import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { dataAPI } from '@/utils/api';
import { useUser } from '@/context/UserContext';

interface Exercise {
  id: string;
  name: string;
  sets: SetData[];
}

interface SetData {
  id: string;
  reps: string;
  weight: string;
  duration: string;
  completed: boolean;
}

interface SavedWorkout {
  id: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  duration: number;
  date: string;
}

export default function WorkoutLoggerScreen() {
  const { isAuthenticated } = useUser();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingWorkouts, setIsFetchingWorkouts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal form state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    reps: '',
    sets: '',
  });

  // Fetch today's saved workouts on mount
  useEffect(() => {
    const fetchTodayWorkouts = async () => {
      if (!isAuthenticated) return;
      
      try {
        setIsFetchingWorkouts(true);
        const today = new Date().toISOString().split('T')[0];
        const data = await dataAPI.getDailyData(today);
        
        if (data?.workouts && Array.isArray(data.workouts)) {
          setSavedWorkouts(data.workouts);
        }
      } catch (err) {
        console.error('Error fetching workouts:', err);
      } finally {
        setIsFetchingWorkouts(false);
      }
    };
    
    fetchTodayWorkouts();
  }, [isAuthenticated]);

  const toggleSetComplete = (exerciseId: string, setId: string) => {
    setExercises(prev =>
      prev.map(exercise =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map(set =>
                set.id === setId ? { ...set, completed: !set.completed } : set
              ),
            }
          : exercise
      )
    );
  };

  const updateSetValue = (
    exerciseId: string,
    setId: string,
    field: 'reps' | 'weight' | 'duration',
    value: string
  ) => {
    setExercises(prev =>
      prev.map(exercise =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map(set =>
                set.id === setId ? { ...set, [field]: value } : set
              ),
            }
          : exercise
      )
    );
  };

  const addSet = (exerciseId: string) => {
    setExercises(prev =>
      prev.map(exercise =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: [
                ...exercise.sets,
                {
                  id: `${exerciseId}-${exercise.sets.length + 1}`,
                  reps: '',
                  weight: '',
                  duration: '',
                  completed: false,
                },
              ],
            }
          : exercise
      )
    );
  };

  const addExerciseFromForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter exercise name');
      return;
    }

    const numSets = parseInt(formData.sets) || 1;
    const reps = formData.reps.trim();

    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: formData.name,
      sets: Array.from({ length: numSets }, (_, index) => ({
        id: `${Date.now()}-${index + 1}`,
        reps: reps,
        weight: '',
        duration: '',
        completed: false,
      })),
    };

    setExercises([...exercises, newExercise]);
    setFormData({ name: '', reps: '', sets: '' });
    setShowModal(false);
  };

  const deleteExercise = (exerciseId: string) => {
    setExercises(prev => prev.filter(ex => ex.id !== exerciseId));
  };

  const saveWorkout = async () => {
    if (!isAuthenticated) {
      setError('Please log in to save workouts');
      return;
    }

    if (exercises.length === 0) {
      setError('Please add at least one exercise');
      return;
    }

    // Check if any exercise has completed sets
    const hasCompletedSets = exercises.some(ex =>
      ex.sets.some(set => set.completed)
    );

    if (!hasCompletedSets) {
      setError('Please check at least one set to save');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      const today = new Date().toISOString().split('T')[0];
      
      // Save only completed sets
      for (const exercise of exercises) {
        // Count how many sets are completed
        let setCount = 0;
        
        for (const set of exercise.sets) {
          if (set.completed) {
            setCount++;
            // Send each completed set as a separate workout entry
            await dataAPI.addWorkout({
              exercise: exercise.name,
              sets: setCount,
              reps: parseInt(set.reps) || 0,
              weight: parseFloat(set.weight) || 0,
              duration: parseInt(set.duration) || 0,
            });
          }
        }
      }

      setSuccessMessage('Workout saved successfully!');
      
      // Refresh the saved workouts list
      const updatedData = await dataAPI.getDailyData(today);
      if (updatedData?.workouts && Array.isArray(updatedData.workouts)) {
        setSavedWorkouts(updatedData.workouts);
      }
      
      // Clear exercises after successful save
      setExercises([]);
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
    } catch (err: any) {
      console.error('Error saving workout:', err);
      console.error('Error details:', err?.response?.data);
      setError(
        err?.response?.data?.detail || 
        err?.message || 
        'Failed to save workout. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <LinearGradient colors={['#0f172a', '#1e293b']} className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 140 }}>
            {/* Header with Gradient Background */}
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.15)', 'rgba(15, 23, 42, 0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}>
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-white text-4xl font-900">Workout Logger</Text>
                  <Text className="text-slate-400 text-sm mt-2">Track your progress today</Text>
                </View>
                <LinearGradient
                  colors={['rgba(168, 85, 247, 0.2)', 'rgba(139, 92, 246, 0.1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 12,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: 'rgba(168, 85, 247, 0.3)',
                  }}>
                  <Text className="text-purple-300 font-bold text-sm">
                    {savedWorkouts.length + exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0)}/
                    <Text className="text-slate-400">{savedWorkouts.length + exercises.reduce((acc, ex) => acc + ex.sets.length, 0)}</Text>
                  </Text>
                  <Text className="text-purple-300 text-xs">completed</Text>
                </LinearGradient>
              </View>
            </LinearGradient>

            {/* Error Message */}
            {error && (
              <LinearGradient
                colors={['rgba(239, 68, 68, 0.15)', 'rgba(239, 68, 68, 0.05)']}
                style={{
                  marginHorizontal: 20,
                  marginBottom: 16,
                  borderRadius: 12,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                }}>
                <View className="flex-row items-start">
                  <MaterialIcons name="error" size={18} color="#fca5a5" style={{ marginRight: 8 }} />
                  <Text className="text-red-300 text-sm flex-1">{error}</Text>
                </View>
              </LinearGradient>
            )}

            {/* Success Message */}
            {successMessage && (
              <LinearGradient
                colors={['rgba(34, 197, 94, 0.15)', 'rgba(34, 197, 94, 0.05)']}
                style={{
                  marginHorizontal: 20,
                  marginBottom: 16,
                  borderRadius: 12,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: 'rgba(34, 197, 94, 0.3)',
                }}>
                <View className="flex-row items-center">
                  <MaterialIcons name="check-circle" size={18} color="#86efac" style={{ marginRight: 8 }} />
                  <Text className="text-green-300 text-sm flex-1">{successMessage}</Text>
                </View>
              </LinearGradient>
            )}

            {/* Quick Add Button */}
            <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
              <TouchableOpacity onPress={() => setShowModal(true)} activeOpacity={0.8}>
                <LinearGradient
                  colors={['rgba(168, 85, 247, 0.25)', 'rgba(168, 85, 247, 0.1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 14,
                    padding: 16,
                    borderWidth: 1.5,
                    borderColor: 'rgba(168, 85, 247, 0.4)',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <MaterialIcons name="add-circle" size={22} color="#c084fc" />
                  <Text className="text-purple-300 text-base font-bold ml-2">Add New Exercise</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Saved Workouts Today */}
            {isFetchingWorkouts ? (
              <View className="px-6 mb-8 items-center">
                <ActivityIndicator size="small" color="#E5E7EB" />
              </View>
            ) : savedWorkouts.length > 0 ? (
              <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
                <View className="flex-row items-center mb-4">
                  <MaterialIcons name="today" size={20} color="#60a5fa" style={{ marginRight: 8 }} />
                  <Text className="text-white text-lg font-800">Today's Workouts</Text>
                </View>
                {savedWorkouts.map((workout, index) => (
                  <LinearGradient
                    key={`${workout.id}-${index}`}
                    colors={['rgba(96, 165, 250, 0.1)', 'rgba(59, 130, 246, 0.05)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: 12,
                      padding: 14,
                      marginBottom: 10,
                      borderWidth: 1,
                      borderColor: 'rgba(96, 165, 250, 0.2)',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View className="flex-row items-center flex-1">
                      <View
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 9,
                          backgroundColor: 'rgba(96, 165, 250, 0.2)',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: 12,
                        }}>
                        <MaterialIcons name="check-circle" size={18} color="#60a5fa" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-white font-bold">{workout.exercise}</Text>
                        <Text className="text-slate-400 text-xs mt-1">
                          {workout.reps > 0 && `${workout.reps} reps`}
                          {workout.weight > 0 && ` • ${workout.weight} lbs`}
                          {workout.duration > 0 && ` • ${workout.duration} min`}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        backgroundColor: 'rgba(96, 165, 250, 0.15)',
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 8,
                      }}>
                      <Text className="text-blue-300 font-bold text-xs">Set {workout.sets}</Text>
                    </View>
                  </LinearGradient>
                ))}
              </View>
            ) : null}

            {/* Exercise List */}
            <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
              {exercises.length === 0 ? (
                <LinearGradient
                  colors={['rgba(51, 65, 85, 0.3)', 'rgba(51, 65, 85, 0.1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 14,
                    padding: 32,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: 'rgba(148, 163, 184, 0.2)',
                  }}>
                  <MaterialIcons name="fitness-center" size={48} color="#64748b" />
                  <Text className="text-slate-400 text-center mt-4 font-semibold">No exercises added yet</Text>
                  <Text className="text-slate-500 text-center text-xs mt-2">Get started by adding your first exercise</Text>
                </LinearGradient>
              ) : (
                exercises.map(exercise => (
                  <LinearGradient
                    key={exercise.id}
                    colors={['rgba(51, 65, 85, 0.3)', 'rgba(51, 65, 85, 0.1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: 14,
                      padding: 16,
                      marginBottom: 14,
                      borderWidth: 1,
                      borderColor: 'rgba(148, 163, 184, 0.2)',
                    }}>
                    {/* Exercise Header */}
                    <View className="flex-row justify-between items-center mb-4">
                      <View className="flex-row items-center flex-1">
                        <View
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 9,
                            backgroundColor: 'rgba(168, 85, 247, 0.2)',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 12,
                          }}>
                          <MaterialIcons name="fitness-center" size={18} color="#c084fc" />
                        </View>
                        <Text className="text-white text-lg font-bold">{exercise.name}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => deleteExercise(exercise.id)}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 9,
                          backgroundColor: 'rgba(239, 68, 68, 0.15)',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <MaterialIcons name="delete" size={18} color="#fca5a5" />
                      </TouchableOpacity>
                    </View>

                    {/* Sets Header */}
                    <View style={{ flexDirection: 'row', marginBottom: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(148, 163, 184, 0.15)' }}>
                      <Text className="text-slate-400 text-xs w-10 text-center font-bold">S</Text>
                      <Text className="text-slate-400 text-xs flex-1 text-center font-bold">REPS</Text>
                      <Text className="text-slate-400 text-xs flex-1 text-center font-bold">WEIGHT</Text>
                      <Text className="text-slate-400 text-xs flex-1 text-center font-bold">MINS</Text>
                      <View style={{ width: 36 }} />
                    </View>

                    {/* Sets */}
                    {exercise.sets.map((set, index) => (
                      <View key={set.id} className="flex-row items-center mb-3">
                        {/* Set Number */}
                        <View className="w-10 items-center">
                          <View
                            style={{
                              backgroundColor: 'rgba(168, 85, 247, 0.15)',
                              borderRadius: 8,
                              paddingHorizontal: 6,
                              paddingVertical: 4,
                              borderWidth: 1,
                              borderColor: 'rgba(168, 85, 247, 0.2)',
                            }}>
                            <Text className="text-purple-300 font-bold text-sm">{index + 1}</Text>
                          </View>
                        </View>

                        {/* Reps Input */}
                        <View className="flex-1 px-1">
                          <TextInput
                            className="text-white text-center py-2 rounded-lg"
                            style={{
                              backgroundColor: 'rgba(15, 23, 42, 0.6)',
                              borderWidth: 1,
                              borderColor: 'rgba(148, 163, 184, 0.2)',
                              color: '#ffffff',
                            }}
                            placeholder="0"
                            placeholderTextColor="#64748b"
                            keyboardType="numeric"
                            value={set.reps}
                            onChangeText={value => updateSetValue(exercise.id, set.id, 'reps', value)}
                          />
                        </View>

                        {/* Weight Input */}
                        <View className="flex-1 px-1">
                          <TextInput
                            className="text-white text-center py-2 rounded-lg"
                            style={{
                              backgroundColor: 'rgba(15, 23, 42, 0.6)',
                              borderWidth: 1,
                              borderColor: 'rgba(148, 163, 184, 0.2)',
                              color: '#ffffff',
                            }}
                            placeholder="0"
                            placeholderTextColor="#64748b"
                            keyboardType="numeric"
                            value={set.weight}
                            onChangeText={value => updateSetValue(exercise.id, set.id, 'weight', value)}
                          />
                        </View>

                        {/* Duration Input */}
                        <View className="flex-1 px-1">
                          <TextInput
                            className="text-white text-center py-2 rounded-lg"
                            style={{
                              backgroundColor: 'rgba(15, 23, 42, 0.6)',
                              borderWidth: 1,
                              borderColor: 'rgba(148, 163, 184, 0.2)',
                              color: '#ffffff',
                            }}
                            placeholder="0"
                            placeholderTextColor="#64748b"
                            keyboardType="numeric"
                            value={set.duration}
                            onChangeText={value => updateSetValue(exercise.id, set.id, 'duration', value)}
                          />
                        </View>

                        {/* Checkbox */}
                        <TouchableOpacity
                          onPress={() => toggleSetComplete(exercise.id, set.id)}
                          style={{ width: 36, alignItems: 'center' }}>
                          <View
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 7,
                              borderWidth: 2,
                              borderColor: set.completed ? '#22c55e' : 'rgba(148, 163, 184, 0.3)',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: set.completed ? 'rgba(34, 197, 94, 0.2)' : 'transparent',
                            }}>
                            {set.completed && (
                              <MaterialIcons name="check" size={16} color="#22c55e" />
                            )}
                          </View>
                        </TouchableOpacity>
                      </View>
                    ))}

                    {/* Add Set Button */}
                    <TouchableOpacity
                      onPress={() => addSet(exercise.id)}
                      style={{
                        backgroundColor: 'rgba(148, 163, 184, 0.15)',
                        borderRadius: 10,
                        paddingVertical: 10,
                        marginTop: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: 'rgba(148, 163, 184, 0.2)',
                      }}>
                      <MaterialIcons name="add" size={16} color="#cbd5e1" />
                      <Text className="text-slate-300 ml-1 font-semibold text-sm">Add Set</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                ))
              )}
            </View>

            {/* Save Workout Button */}
            <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
              <TouchableOpacity onPress={saveWorkout} disabled={isLoading} activeOpacity={0.8}>
                <LinearGradient
                  colors={isLoading ? ['rgba(96, 165, 250, 0.15)', 'rgba(59, 130, 246, 0.08)'] : ['rgba(96, 165, 250, 0.3)', 'rgba(59, 130, 246, 0.15)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 14,
                    paddingVertical: 16,
                    alignItems: 'center',
                    borderWidth: 1.5,
                    borderColor: 'rgba(96, 165, 250, 0.4)',
                    opacity: isLoading ? 0.7 : 1,
                  }}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#60a5fa" />
                  ) : (
                    <View className="flex-row items-center">
                      <MaterialIcons name="save" size={20} color="#60a5fa" />
                      <Text className="text-blue-300 text-base font-bold ml-2">Save Workout</Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Add Exercise Modal */}
        <Modal
          visible={showModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowModal(false)}>
          <BlurView intensity={90} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={120}
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
              <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                keyboardDismissMode="on-drag"
                scrollEnabled={true}>
              <LinearGradient
                colors={['rgba(51, 65, 85, 0.95)', 'rgba(30, 41, 59, 0.95)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 24,
                  padding: 28,
                  width: '100%',
                  maxWidth: 500,
                  borderWidth: 1,
                  borderColor: 'rgba(168, 85, 247, 0.4)',
                  shadowColor: '#000000',
                  shadowOpacity: 0.5,
                  shadowRadius: 20,
                  shadowOffset: { width: 0, height: 10 },
                  elevation: 20,
                  paddingBottom: 40,
                }}>
                {/* Modal Header with Gradient Background */}
                <LinearGradient
                  colors={['rgba(168, 85, 247, 0.2)', 'rgba(168, 85, 247, 0.05)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 24,
                    borderWidth: 1,
                    borderColor: 'rgba(168, 85, 247, 0.3)',
                  }}>
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="text-white text-2xl font-900">Add Exercise</Text>
                      <Text className="text-slate-300 text-sm mt-2">Log a new workout session</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setShowModal(false)}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        backgroundColor: 'rgba(239, 68, 68, 0.15)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 12,
                      }}>
                      <MaterialIcons name="close" size={22} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>

                {/* Exercise Name Input */}
                <View className="mb-5">
                  <View className="flex-row items-center mb-3">
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        backgroundColor: 'rgba(168, 85, 247, 0.15)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 10,
                        borderWidth: 1,
                        borderColor: 'rgba(168, 85, 247, 0.3)',
                      }}>
                      <MaterialIcons name="fitness-center" size={18} color="#c084fc" />
                    </View>
                    <Text className="text-white font-bold text-sm">Exercise Name</Text>
                  </View>
                  <TextInput
                    className="text-white px-4 py-4 rounded-lg"
                    style={{
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      borderWidth: 1.5,
                      borderColor: 'rgba(168, 85, 247, 0.25)',
                      color: '#ffffff',
                      fontSize: 15,
                    }}
                    placeholder="e.g., Bench Press"
                    placeholderTextColor="#64748b"
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                  />
                </View>

                {/* Reps Per Set Input */}
                <View className="mb-5">
                  <View className="flex-row items-center mb-3">
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 10,
                        borderWidth: 1,
                        borderColor: 'rgba(59, 130, 246, 0.3)',
                      }}>
                      <MaterialIcons name="repeat" size={18} color="#3b82f6" />
                    </View>
                    <Text className="text-white font-bold text-sm">Reps Per Set</Text>
                  </View>
                  <TextInput
                    className="text-white px-4 py-4 rounded-lg"
                    style={{
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      borderWidth: 1.5,
                      borderColor: 'rgba(59, 130, 246, 0.25)',
                      color: '#ffffff',
                      fontSize: 15,
                    }}
                    placeholder="e.g., 10"
                    placeholderTextColor="#64748b"
                    keyboardType="numeric"
                    value={formData.reps}
                    onChangeText={(text) => setFormData({ ...formData, reps: text })}
                  />
                </View>

                {/* Number of Sets Input */}
                <View className="mb-7">
                  <View className="flex-row items-center mb-3">
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        backgroundColor: 'rgba(34, 197, 94, 0.15)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 10,
                        borderWidth: 1,
                        borderColor: 'rgba(34, 197, 94, 0.3)',
                      }}>
                      <MaterialIcons name="layers" size={18} color="#22c55e" />
                    </View>
                    <Text className="text-white font-bold text-sm">Number of Sets</Text>
                  </View>
                  <TextInput
                    className="text-white px-4 py-4 rounded-lg"
                    style={{
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      borderWidth: 1.5,
                      borderColor: 'rgba(34, 197, 94, 0.25)',
                      color: '#ffffff',
                      fontSize: 15,
                    }}
                    placeholder="e.g., 3"
                    placeholderTextColor="#64748b"
                    keyboardType="numeric"
                    value={formData.sets}
                    onChangeText={(text) => setFormData({ ...formData, sets: text })}
                  />
                </View>

                {/* Action Buttons */}
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => setShowModal(false)}
                    className="flex-1"
                    style={{
                      paddingVertical: 14,
                      borderRadius: 12,
                    }}>
                    <LinearGradient
                      colors={['rgba(71, 85, 105, 0.3)', 'rgba(51, 65, 85, 0.5)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        borderRadius: 12,
                        paddingVertical: 14,
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: 'rgba(148, 163, 184, 0.3)',
                      }}>
                      <View className="flex-row items-center justify-center">
                        <MaterialIcons name="close" size={18} color="#cbd5e1" />
                        <Text className="text-slate-300 text-center font-bold ml-2">Cancel</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={addExerciseFromForm}
                    className="flex-1">
                    <LinearGradient
                      colors={['rgba(168, 85, 247, 0.4)', 'rgba(168, 85, 247, 0.2)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        borderRadius: 12,
                        paddingVertical: 14,
                        alignItems: 'center',
                        borderWidth: 1.5,
                        borderColor: 'rgba(168, 85, 247, 0.5)',
                        shadowColor: '#a855f7',
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 8,
                      }}>
                      <View className="flex-row items-center justify-center">
                        <MaterialIcons name="add-circle" size={18} color="#e9d5ff" />
                        <Text className="text-purple-200 text-center font-bold ml-2">Add Exercise</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
              </ScrollView>
            </KeyboardAvoidingView>
          </BlurView>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}
