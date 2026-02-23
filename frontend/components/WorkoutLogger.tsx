import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

interface Exercise {
  id: string;
  name: string;
  sets: SetData[];
}

interface SetData {
  id: string;
  reps: string;
  weight: string;
  completed: boolean;
}

export default function WorkoutLoggerScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: '1',
      name: 'Bench Press',
      sets: [
        { id: '1-1', reps: '10', weight: '135', completed: false },
        { id: '1-2', reps: '8', weight: '155', completed: false },
        { id: '1-3', reps: '8', weight: '155', completed: false },
        { id: '1-4', reps: '6', weight: '175', completed: false },
      ],
    },
    {
      id: '2',
      name: 'Squats',
      sets: [
        { id: '2-1', reps: '10', weight: '185', completed: false },
        { id: '2-2', reps: '10', weight: '185', completed: false },
        { id: '2-3', reps: '8', weight: '205', completed: false },
      ],
    },
  ]);

  const [newExerciseName, setNewExerciseName] = useState('');

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
    field: 'reps' | 'weight',
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
                  completed: false,
                },
              ],
            }
          : exercise
      )
    );
  };

  const addExercise = () => {
    if (!newExerciseName.trim()) return;

    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: newExerciseName,
      sets: [
        {
          id: `${Date.now()}-1`,
          reps: '',
          weight: '',
          completed: false,
        },
      ],
    };

    setExercises([...exercises, newExercise]);
    setNewExerciseName('');
  };

  const deleteExercise = (exerciseId: string) => {
    setExercises(prev => prev.filter(ex => ex.id !== exerciseId));
  };

  return (
    <LinearGradient colors={['#0f172a', '#1e293b']} className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1">
          {/* Header */}
          <View className="pt-12 pb-6 px-6">
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

          {/* Add Exercise */}
          <View className="px-6 mb-6">
            <View className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
              <Text className="text-white font-semibold mb-3">Add Exercise</Text>
              <View className="flex-row">
                <TextInput
                  className="flex-1 bg-slate-900 text-white px-4 py-3 rounded-xl mr-2"
                  placeholder="Exercise name..."
                  placeholderTextColor="#64748b"
                  value={newExerciseName}
                  onChangeText={setNewExerciseName}
                />
                <TouchableOpacity
                  onPress={addExercise}
                  className="bg-emerald-500 rounded-xl px-5 justify-center"
                >
                  <MaterialIcons name="add" size={24} color="#0f172a" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Exercise List */}
          <View className="px-6 pb-8">
            {exercises.map(exercise => (
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
            ))}
          </View>

          {/* Save Workout Button */}
          <View className="px-6 pb-8">
            <TouchableOpacity>
              <LinearGradient
                colors={['#10b981', '#059669']}
                className="rounded-2xl py-4 items-center"
                style={{
                  shadowColor: '#10b981',
                  shadowOpacity: 0.4,
                  shadowRadius: 10,
                  elevation: 5,
                }}
              >
                <Text className="text-slate-900 text-lg font-bold">Save Workout</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
