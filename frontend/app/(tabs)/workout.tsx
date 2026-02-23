import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface WorkoutForm {
  exercise: string;
  sets: string;
  reps: string;
  weight: string;
  duration: string;
}

export default function WorkoutScreen() {
  const [form, setForm] = useState<WorkoutForm>({
    exercise: "",
    sets: "",
    reps: "",
    weight: "",
    duration: "",
  });

  const [submittedWorkouts, setSubmittedWorkouts] = useState<any[]>([]);

  const handleInputChange = (field: keyof WorkoutForm, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const validateForm = () => {
    if (!form.exercise.trim()) {
      Alert.alert("Error", "Please enter exercise name");
      return false;
    }
    if (!form.sets || isNaN(Number(form.sets)) || Number(form.sets) <= 0) {
      Alert.alert("Error", "Sets must be a valid positive number");
      return false;
    }
    if (!form.reps || isNaN(Number(form.reps)) || Number(form.reps) <= 0) {
      Alert.alert("Error", "Reps must be a valid positive number");
      return false;
    }
    if (!form.weight || isNaN(Number(form.weight)) || Number(form.weight) <= 0) {
      Alert.alert("Error", "Weight must be a valid positive number");
      return false;
    }
    if (!form.duration || isNaN(Number(form.duration)) || Number(form.duration) <= 0) {
      Alert.alert("Error", "Duration must be a valid positive number");
      return false;
    }
    return true;
  };

  const handleAddWorkout = () => {
    if (!validateForm()) return;

    const newWorkout = {
      id: Date.now().toString(),
      ...form,
      sets: Number(form.sets),
      reps: Number(form.reps),
      weight: Number(form.weight),
      duration: Number(form.duration),
      timestamp: new Date().toLocaleString(),
    };

    setSubmittedWorkouts([newWorkout, ...submittedWorkouts]);

    // Reset form
    setForm({
      exercise: "",
      sets: "",
      reps: "",
      weight: "",
      duration: "",
    });

    Alert.alert("Success", "Workout logged successfully!");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-900"
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8 pb-8">
          <Text className="text-3xl font-bold text-white mb-8">
            Log Workout
          </Text>

          {/* Form */}
          <View className="mb-8">
            {/* Exercise Name */}
            <View className="mb-6">
              <Text className="text-white font-semibold mb-2">
                Exercise Name
              </Text>
              <TextInput
                placeholder="e.g., Bench Press"
                placeholderTextColor="#9ca3af"
                value={form.exercise}
                onChangeText={(value) => handleInputChange("exercise", value)}
                className="bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700"
              />
            </View>

            {/* Sets and Reps */}
            <View className="flex-row gap-4 mb-6">
              <View className="flex-1">
                <Text className="text-white font-semibold mb-2">Sets</Text>
                <TextInput
                  placeholder="4"
                  placeholderTextColor="#9ca3af"
                  keyboardType="number-pad"
                  value={form.sets}
                  onChangeText={(value) => handleInputChange("sets", value)}
                  className="bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700"
                />
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold mb-2">Reps</Text>
                <TextInput
                  placeholder="8"
                  placeholderTextColor="#9ca3af"
                  keyboardType="number-pad"
                  value={form.reps}
                  onChangeText={(value) => handleInputChange("reps", value)}
                  className="bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700"
                />
              </View>
            </View>

            {/* Weight */}
            <View className="mb-6">
              <Text className="text-white font-semibold mb-2">Weight (lbs)</Text>
              <TextInput
                placeholder="185"
                placeholderTextColor="#9ca3af"
                keyboardType="decimal-pad"
                value={form.weight}
                onChangeText={(value) => handleInputChange("weight", value)}
                className="bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700"
              />
            </View>

            {/* Duration */}
            <View className="mb-6">
              <Text className="text-white font-semibold mb-2">Duration (minutes)</Text>
              <TextInput
                placeholder="45"
                placeholderTextColor="#9ca3af"
                keyboardType="number-pad"
                value={form.duration}
                onChangeText={(value) => handleInputChange("duration", value)}
                className="bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700"
              />
            </View>

            {/* Add Workout Button */}
            <TouchableOpacity
              onPress={handleAddWorkout}
              className="bg-blue-600 rounded-lg py-4 items-center mt-4"
            >
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="add" size={24} color="white" />
                <Text className="text-white font-bold text-lg">Add Workout</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Recently Added */}
          {submittedWorkouts.length > 0 && (
            <View className="mt-8">
              <Text className="text-xl font-bold text-white mb-4">
                Recently Added
              </Text>
              {submittedWorkouts.map((workout) => (
                <View key={workout.id} className="bg-gray-800 rounded-lg p-4 mb-3">
                  <View className="flex-row justify-between items-start mb-2">
                    <View>
                      <Text className="text-white font-bold text-lg">
                        {workout.exercise}
                      </Text>
                      <Text className="text-gray-400 text-sm">
                        {workout.timestamp}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-300">
                      {workout.sets} × {workout.reps}
                    </Text>
                    <Text className="text-gray-300">{workout.weight} lbs</Text>
                    <Text className="text-gray-300">{workout.duration} min</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
