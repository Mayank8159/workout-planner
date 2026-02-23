// @ts-ignore - NativeWind className support
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
    <ScrollView className="flex-1 bg-dark-bg">
      <View className="px-6 pt-8">
        <Text className="text-3xl font-bold text-cyan-400 mb-8">Dashboard</Text>

        {/* Stats Cards */}
        <View className="flex-row justify-between mb-8 gap-4">
          <View className="flex-1 rounded-xl p-4 border border-opacity-30 border-neon-purple shadow-glow-purple"
            style={{
              backgroundColor: 'rgba(26, 31, 58, 0.5)',
              borderColor: 'rgba(168, 85, 247, 0.3)',
              shadowColor: '#a855f7',
              shadowOpacity: 0.6,
              shadowRadius: 15,
            }}>
            <MaterialIcons name="fitness-center" size={24} color="#06b6d4" />
            <Text className="text-white text-2xl font-bold mt-2">
              {totalWorkouts}
            </Text>
            <Text className="text-cyan-400 text-sm">Total Workouts</Text>
          </View>
          <View className="flex-1 rounded-xl p-4 border border-opacity-30 border-neon-blue shadow-glow-blue"
            style={{
              backgroundColor: 'rgba(26, 31, 58, 0.5)',
              borderColor: 'rgba(14, 165, 233, 0.3)',
              shadowColor: '#0ea5e9',
              shadowOpacity: 0.6,
              shadowRadius: 15,
            }}>
            <MaterialIcons name="show-chart" size={24} color="#06b6d4" />
            <Text className="text-white text-2xl font-bold mt-2">
              {totalVolume.toLocaleString()}
            </Text>
            <Text className="text-cyan-400 text-sm">Total Volume</Text>
          </View>
        </View>

        <View className="flex-row justify-between mb-8 gap-4">
          <View className="flex-1 rounded-xl p-4 border border-opacity-30 border-neon-cyan shadow-glow-cyan"
            style={{
              backgroundColor: 'rgba(26, 31, 58, 0.5)',
              borderColor: 'rgba(6, 182, 212, 0.3)',
              shadowColor: '#06b6d4',
              shadowOpacity: 0.6,
              shadowRadius: 15,
            }}>
            <MaterialIcons name="schedule" size={24} color="#a855f7" />
            <Text className="text-white text-2xl font-bold mt-2">
              {totalDuration} min
            </Text>
            <Text className="text-cyan-400 text-sm">Total Duration</Text>
          </View>
        </View>

        {/* Workout History */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-cyan-400 mb-4">
            Workout History
          </Text>
          {workoutHistory.length === 0 ? (
            <View className="rounded-xl p-6 items-center border border-opacity-30 border-neon-purple"
              style={{
                backgroundColor: 'rgba(26, 31, 58, 0.5)',
                borderColor: 'rgba(168, 85, 247, 0.3)',
                shadowColor: '#a855f7',
                shadowOpacity: 0.4,
                shadowRadius: 10,
              }}>
              <MaterialIcons name="history" size={48} color="#06b6d4" />
              <Text className="text-cyan-400 text-center mt-4">
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
                <View className="rounded-xl p-4 mb-3 border border-opacity-30 border-neon-blue"
                  style={{
                    backgroundColor: 'rgba(26, 31, 58, 0.5)',
                    borderColor: 'rgba(14, 165, 233, 0.3)',
                    shadowColor: '#0ea5e9',
                    shadowOpacity: 0.4,
                    shadowRadius: 10,
                  }}>
                  <View className="flex-row justify-between items-start mb-2">
                    <View>
                      <Text className="text-white font-bold text-lg">
                        {item.exercise}
                      </Text>
                      <Text className="text-cyan-400 text-sm">{item.date}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteWorkout(item.id)}
                    >
                      <MaterialIcons
                        name="close"
                        size={20}
                        color="#ec4899"
                      />
                    </TouchableOpacity>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-cyan-300">
                      {item.sets} sets × {item.reps} reps
                    </Text>
                    <Text className="text-cyan-300">{item.weight} lbs</Text>
                    <Text className="text-cyan-300">{item.duration} min</Text>
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
