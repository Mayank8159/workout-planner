import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function SplashScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Main Logo/Icon */}
      <View className="mb-8">
        <MaterialIcons name="fitness-center" size={64} color="#3b82f6" />
      </View>

      {/* Title */}
      <Text className="text-4xl font-bold text-white mb-2">
        Workout Planner
      </Text>
      <Text className="text-lg text-slate-400 mb-16">
        Loading your fitness journey...
      </Text>

      {/* Simple Loading Spinner */}
      <View className="flex-row gap-2 mb-8">
        <View className="w-2 h-2 rounded-full bg-blue-500" />
        <View className="w-2 h-2 rounded-full bg-purple-500" />
        <View className="w-2 h-2 rounded-full bg-green-500" />
      </View>

      {/* Progress Bar */}
      <View className="w-32 h-1 bg-slate-700 rounded-full overflow-hidden">
        <View className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600" />
      </View>
    </View>
  );
}
