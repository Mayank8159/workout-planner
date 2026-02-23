import React, { useState } from 'react';
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

export default function WorkoutLoggerScreen() {
  const { isAuthenticated } = useUser();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal form state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    reps: '',
    sets: '',
  });

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

    // Check if any exercise has set data
    const hasSetData = exercises.some(ex =>
      ex.sets.some(set => set.reps.trim() || set.weight.trim() || set.duration.trim())
    );

    if (!hasSetData) {
      setError('Please add reps, weight, or duration to at least one set');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      const today = new Date().toISOString().split('T')[0];
      
      // Save all exercises
      for (const exercise of exercises) {
        // Count how many sets have actual data
        let setCount = 0;
        
        for (const set of exercise.sets) {
          const hasData = set.reps.trim() || set.weight.trim() || set.duration.trim();
          if (hasData) {
            setCount++;
            // Send each set as a separate workout entry
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
      
      // Clear exercises after successful save
      setTimeout(() => {
        setExercises([]);
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
          <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Header */}
            <View className="pt-6 pb-6 px-6">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-white text-3xl font-bold">Workout Logger</Text>
                  <Text className="text-slate-400 text-sm mt-1">Track your exercises</Text>
                </View>
                <View className="bg-emerald-500/20 rounded-2xl px-4 py-2">
                  <Text className="text-emerald-500 font-bold">
                    {exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0)} /{' '}
                    {exercises.reduce((acc, ex) => acc + ex.sets.length, 0)} sets
                  </Text>
                </View>
              </View>
            </View>

            {/* Error Message */}
            {error && (
              <View className="mx-6 mb-4 bg-red-500/20 border border-red-500 rounded-xl p-3">
                <Text className="text-red-300 text-sm">{error}</Text>
              </View>
            )}

            {/* Success Message */}
            {successMessage && (
              <View className="mx-6 mb-4 bg-emerald-500/20 border border-emerald-500 rounded-xl p-3">
                <Text className="text-emerald-300 text-sm">{successMessage}</Text>
              </View>
            )}

            {/* Add Exercise Button */}
            <View className="px-6 mb-6">
              <TouchableOpacity onPress={() => setShowModal(true)}>
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  className="rounded-2xl py-4 items-center flex-row justify-center"
                  style={{
                    shadowColor: '#10b981',
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <MaterialIcons name="add" size={24} color="#0f172a" />
                  <Text className="text-slate-900 text-lg font-bold ml-2">Add Exercise</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Exercise List */}
            <View className="px-6 pb-8">
              {exercises.length === 0 ? (
                <View className="bg-slate-800 border border-slate-700 rounded-2xl p-8 items-center">
                  <MaterialIcons name="fitness-center" size={48} color="#64748b" />
                  <Text className="text-slate-400 text-center mt-4">No exercises added yet</Text>
                  <Text className="text-slate-500 text-center text-sm mt-2">Tap the Add Exercise button to get started</Text>
                </View>
              ) : (
                exercises.map(exercise => (
                  <View
                    key={exercise.id}
                    className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mb-4"
                  >
                    {/* Exercise Header */}
                    <View className="flex-row justify-between items-center mb-4">
                      <View className="flex-row items-center flex-1">
                        <View className="bg-emerald-500/20 rounded-full p-2 mr-3">
                          <MaterialIcons name="fitness-center" size={20} color="#10b981" />
                        </View>
                        <Text className="text-white text-lg font-bold">{exercise.name}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => deleteExercise(exercise.id)}
                        className="bg-red-500/20 rounded-full p-2"
                      >
                        <MaterialIcons name="delete" size={18} color="#ef4444" />
                      </TouchableOpacity>
                    </View>

                    {/* Sets Header */}
                    <View className="flex-row mb-2 pb-2 border-b border-slate-700">
                      <Text className="text-slate-400 text-xs w-12 text-center">SET</Text>
                      <Text className="text-slate-400 text-xs flex-1 text-center">REPS</Text>
                      <Text className="text-slate-400 text-xs flex-1 text-center">WEIGHT (lbs)</Text>
                      <Text className="text-slate-400 text-xs flex-1 text-center">DURATION (min)</Text>
                      <View className="w-12" />
                    </View>

                    {/* Sets */}
                    {exercise.sets.map((set, index) => (
                      <View key={set.id} className="flex-row items-center mb-3">
                        {/* Set Number */}
                        <View className="w-12 items-center">
                          <View className="bg-slate-700 rounded-lg px-2 py-1">
                            <Text className="text-white font-bold text-sm">{index + 1}</Text>
                          </View>
                        </View>

                        {/* Reps Input */}
                        <View className="flex-1 px-1">
                          <TextInput
                            className="bg-slate-900 text-white text-center py-2 rounded-lg"
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
                            className="bg-slate-900 text-white text-center py-2 rounded-lg"
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
                            className="bg-slate-900 text-white text-center py-2 rounded-lg"
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
                          className="w-12 items-center"
                        >
                          <View
                            className={`w-8 h-8 rounded-lg border-2 items-center justify-center ${
                              set.completed
                                ? 'bg-emerald-500 border-emerald-500'
                                : 'border-slate-600'
                            }`}
                          >
                            {set.completed && (
                              <MaterialIcons name="check" size={20} color="#0f172a" />
                            )}
                          </View>
                        </TouchableOpacity>
                      </View>
                    ))}

                    {/* Add Set Button */}
                    <TouchableOpacity
                      onPress={() => addSet(exercise.id)}
                      className="bg-slate-700 rounded-xl py-2 mt-2 flex-row items-center justify-center"
                    >
                      <MaterialIcons name="add" size={18} color="#10b981" />
                      <Text className="text-emerald-500 ml-1 font-semibold">Add Set</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>

            {/* Save Workout Button */}
            <View className="px-6 pb-8">
              <TouchableOpacity onPress={saveWorkout} disabled={isLoading}>
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  className="rounded-2xl py-4 items-center"
                  style={{
                    shadowColor: '#10b981',
                    shadowOpacity: 0.4,
                    shadowRadius: 10,
                    elevation: 5,
                    opacity: isLoading ? 0.6 : 1,
                  }}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#0f172a" />
                  ) : (
                    <Text className="text-slate-900 text-lg font-bold">Save Workout</Text>
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
          onRequestClose={() => setShowModal(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-96">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-white text-2xl font-bold">Add Exercise</Text>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <MaterialIcons name="close" size={28} color="#64748b" />
                </TouchableOpacity>
              </View>

              {/* Exercise Name Input */}
              <View className="mb-4">
                <Text className="text-white font-semibold mb-2">Exercise Name</Text>
                <TextInput
                  className="bg-slate-900 text-white px-4 py-3 rounded-xl border border-slate-700"
                  placeholder="e.g., Bench Press, Squats..."
                  placeholderTextColor="#64748b"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                />
              </View>

              {/* Reps Per Set Input */}
              <View className="mb-4">
                <Text className="text-white font-semibold mb-2">Reps Per Set</Text>
                <TextInput
                  className="bg-slate-900 text-white px-4 py-3 rounded-xl border border-slate-700"
                  placeholder="e.g., 10, 8, 12..."
                  placeholderTextColor="#64748b"
                  keyboardType="numeric"
                  value={formData.reps}
                  onChangeText={(text) => setFormData({ ...formData, reps: text })}
                />
              </View>

              {/* Number of Sets Input */}
              <View className="mb-6">
                <Text className="text-white font-semibold mb-2">Number of Sets</Text>
                <TextInput
                  className="bg-slate-900 text-white px-4 py-3 rounded-xl border border-slate-700"
                  placeholder="e.g., 3, 4, 5..."
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
                  className="flex-1 bg-slate-700 rounded-xl py-3"
                >
                  <Text className="text-white text-center font-semibold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={addExerciseFromForm}
                  className="flex-1 bg-emerald-500 rounded-xl py-3"
                >
                  <Text className="text-slate-900 text-center font-bold">Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}
