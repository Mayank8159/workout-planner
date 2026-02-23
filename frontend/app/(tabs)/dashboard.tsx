import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface WorkoutEntry {
  id: string;
  date: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  duration: number;
}

export default function DashboardScreen() {
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutEntry[]>([
    {
      id: "1",
      date: new Date().toLocaleDateString(),
      exercise: "Bench Press",
      sets: 4,
      reps: 8,
      weight: 185,
      duration: 45,
    },
    {
      id: "2",
      date: new Date(Date.now() - 86400000).toLocaleDateString(),
      exercise: "Squats",
      sets: 4,
      reps: 10,
      weight: 225,
      duration: 50,
    },
    {
      id: "3",
      date: new Date(Date.now() - 172800000).toLocaleDateString(),
      exercise: "Deadlifts",
      sets: 3,
      reps: 5,
      weight: 315,
      duration: 35,
    },
  ]);

  const totalWorkouts = useMemo(() => workoutHistory.length, [workoutHistory]);
  const totalVolume = useMemo(
    () =>
      workoutHistory.reduce(
        (acc, entry) => acc + entry.sets * entry.reps * entry.weight,
        0
      ),
    [workoutHistory]
  );
  const totalDuration = useMemo(
    () => workoutHistory.reduce((acc, entry) => acc + entry.duration, 0),
    [workoutHistory]
  );

  const handleDeleteWorkout = (id: string) => {
    Alert.alert("Delete Workout", "Are you sure you want to delete this entry?", [
      {
        text: "Cancel",
        onPress: () => {},
      },
      {
        text: "Delete",
        onPress: () => {
          setWorkoutHistory(workoutHistory.filter((w) => w.id !== id));
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-gray-900">
      <View className="px-6 pt-8">
        <Text className="text-3xl font-bold text-white mb-8">Dashboard</Text>

        {/* Stats Cards */}
        <View className="flex-row justify-between mb-8 gap-4">
          <View className="flex-1 bg-blue-600 rounded-lg p-4">
            <MaterialIcons name="fitness-center" size={24} color="white" />
            <Text className="text-white text-2xl font-bold mt-2">
              {totalWorkouts}
            </Text>
            <Text className="text-blue-100 text-sm">Total Workouts</Text>
          </View>
          <View className="flex-1 bg-green-600 rounded-lg p-4">
            <MaterialIcons name="show-chart" size={24} color="white" />
            <Text className="text-white text-2xl font-bold mt-2">
              {totalVolume.toLocaleString()}
            </Text>
            <Text className="text-green-100 text-sm">Total Volume</Text>
          </View>
        </View>

        <View className="flex-row justify-between mb-8 gap-4">
          <View className="flex-1 bg-purple-600 rounded-lg p-4">
            <MaterialIcons name="schedule" size={24} color="white" />
            <Text className="text-white text-2xl font-bold mt-2">
              {totalDuration} min
            </Text>
            <Text className="text-purple-100 text-sm">Total Duration</Text>
          </View>
        </View>

        {/* Workout History */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-white mb-4">
            Workout History
          </Text>
          {workoutHistory.length === 0 ? (
            <View className="bg-gray-800 rounded-lg p-6 items-center">
              <MaterialIcons name="history" size={48} color="#9ca3af" />
              <Text className="text-gray-400 text-center mt-4">
                No workouts yet. Start logging your exercises!
              </Text>
            </View>
          ) : (
            <FlatList
              scrollEnabled={false}
              data={workoutHistory.sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View className="bg-gray-800 rounded-lg p-4 mb-3">
                  <View className="flex-row justify-between items-start mb-2">
                    <View>
                      <Text className="text-white font-bold text-lg">
                        {item.exercise}
                      </Text>
                      <Text className="text-gray-400 text-sm">{item.date}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteWorkout(item.id)}
                    >
                      <MaterialIcons
                        name="close"
                        size={20}
                        color="#ef4444"
                      />
                    </TouchableOpacity>
                  </View>
                  <View className="flex-row justify-between text-gray-300">
                    <Text className="text-gray-300">
                      {item.sets} sets × {item.reps} reps
                    </Text>
                    <Text className="text-gray-300">{item.weight} lbs</Text>
                    <Text className="text-gray-300">{item.duration} min</Text>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}
