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
      className="flex-1 bg-dark-bg"
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8 pb-8">
          <Text className="text-3xl font-bold text-cyan-400 mb-8">
            Log Workout
          </Text>

          {/* Form */}
          <View className="mb-8">
            {/* Exercise Name */}
            <View className="mb-6">
              <Text className="text-cyan-400 font-semibold mb-2">
                Exercise Name
              </Text>
              <TextInput
                placeholder="e.g., Bench Press"
                placeholderTextColor="#6b7280"
                value={form.exercise}
                onChangeText={(value) => handleInputChange("exercise", value)}
                style={{
                  backgroundColor: 'rgba(26, 31, 58, 0.5)',
                  color: 'white',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: 'rgba(168, 85, 247, 0.3)',
                }}
              />
            </View>

            {/* Sets and Reps */}
            <View className="flex-row gap-4 mb-6">
              <View className="flex-1">
                <Text className="text-cyan-400 font-semibold mb-2">Sets</Text>
                <TextInput
                  placeholder="4"
                  placeholderTextColor="#6b7280"
                  keyboardType="number-pad"
                  value={form.sets}
                  onChangeText={(value) => handleInputChange("sets", value)}
                  style={{
                    backgroundColor: 'rgba(26, 31, 58, 0.5)',
                    color: 'white',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderWidth: 1,
                    borderColor: 'rgba(168, 85, 247, 0.3)',
                  }}
                />
              </View>
              <View className="flex-1">
                <Text className="text-cyan-400 font-semibold mb-2">Reps</Text>
                <TextInput
                  placeholder="8"
                  placeholderTextColor="#6b7280"
                  keyboardType="number-pad"
                  value={form.reps}
                  onChangeText={(value) => handleInputChange("reps", value)}
                  style={{
                    backgroundColor: 'rgba(26, 31, 58, 0.5)',
                    color: 'white',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderWidth: 1,
                    borderColor: 'rgba(168, 85, 247, 0.3)',
                  }}
                />
              </View>
            </View>

            {/* Weight */}
            <View className="mb-6">
              <Text className="text-cyan-400 font-semibold mb-2">Weight (lbs)</Text>
              <TextInput
                placeholder="185"
                placeholderTextColor="#6b7280"
                keyboardType="decimal-pad"
                value={form.weight}
                onChangeText={(value) => handleInputChange("weight", value)}
                style={{
                  backgroundColor: 'rgba(26, 31, 58, 0.5)',
                  color: 'white',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: 'rgba(168, 85, 247, 0.3)',
                }}
              />
            </View>

            {/* Duration */}
            <View className="mb-6">
              <Text className="text-cyan-400 font-semibold mb-2">Duration (minutes)</Text>
              <TextInput
                placeholder="45"
                placeholderTextColor="#6b7280"
                keyboardType="number-pad"
                value={form.duration}
                onChangeText={(value) => handleInputChange("duration", value)}
                style={{
                  backgroundColor: 'rgba(26, 31, 58, 0.5)',
                  color: 'white',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: 'rgba(168, 85, 247, 0.3)',
                }}
              />
            </View>

            {/* Add Workout Button */}
            <TouchableOpacity
              onPress={handleAddWorkout}
              style={{
                backgroundColor: 'rgba(168, 85, 247, 0.8)',
                borderRadius: 12,
                paddingVertical: 16,
                marginTop: 16,
                alignItems: 'center',
                shadowColor: '#a855f7',
                shadowOpacity: 0.6,
                shadowRadius: 15,
              }}
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
              <Text className="text-xl font-bold text-cyan-400 mb-4">
                Recently Added
              </Text>
              {submittedWorkouts.map((workout) => (
                <View 
                  key={workout.id} 
                  style={{
                    backgroundColor: 'rgba(26, 31, 58, 0.5)',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: 'rgba(14, 165, 233, 0.3)',
                    shadowColor: '#0ea5e9',
                    shadowOpacity: 0.4,
                    shadowRadius: 10,
                  }}
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View>
                      <Text className="text-white font-bold text-lg">
                        {workout.exercise}
                      </Text>
                      <Text className="text-cyan-400 text-sm">
                        {workout.timestamp}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-cyan-300">
                      {workout.sets} × {workout.reps}
                    </Text>
                    <Text className="text-cyan-300">{workout.weight} lbs</Text>
                    <Text className="text-cyan-300">{workout.duration} min</Text>
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
