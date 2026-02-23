import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface DayData {
  date: Date;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
}

export default function DashboardScreen() {
  const { user, isAuthenticated } = useUser();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState<DayData[]>([]);
  
  // Nutrition data (mock - replace with API call)
  const [nutritionData, setNutritionData] = useState({
    consumed: 1450,
    goal: 2200,
    carbs: 180,
    protein: 90,
    fat: 45,
  });

  // Generate week days
  useEffect(() => {
    const generateWeek = () => {
      const days: DayData[] = [];
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday

      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        days.push({
          date,
          dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
          dayNumber: date.getDate(),
          isToday: date.toDateString() === today.toDateString(),
        });
      }
      setWeekDays(days);
    };

    generateWeek();
  }, []);

  const progress = nutritionData.consumed / nutritionData.goal;
  const remaining = Math.max(0, nutritionData.goal - nutritionData.consumed);

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <LinearGradient
        colors={['#0f172a', '#1e293b']}
        className="flex-1"
      >
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Header */}
          <View className="pt-6 pb-6 px-6">
            <View className="flex-row justify-between items-center mb-2">
              <View>
                <Text className="text-slate-400 text-sm">Welcome back,</Text>
                <Text className="text-white text-3xl font-bold">{user?.username || 'User'}</Text>
              </View>
              <TouchableOpacity className="bg-slate-800 rounded-full p-3 border border-slate-700">
                <MaterialIcons name="notifications-none" size={24} color="#10b981" />
              </TouchableOpacity>
            </View>
          </View>

        {/* Weekly Calendar Strip */}
        <View className="px-6 mb-6">
          <Text className="text-white text-lg font-semibold mb-4">This Week</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {weekDays.map((day, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedDate(day.date)}
                className={`mr-3 items-center justify-center rounded-2xl px-4 py-3 ${
                  day.isToday
                    ? 'bg-emerald-500'
                    : selectedDate.toDateString() === day.date.toDateString()
                    ? 'bg-slate-700'
                    : 'bg-slate-800 border border-slate-700'
                }`}
                style={{ minWidth: 60 }}
              >
                <Text
                  className={`text-xs mb-1 ${
                    day.isToday ? 'text-slate-900 font-bold' : 'text-slate-400'
                  }`}
                >
                  {day.dayName}
                </Text>
                <Text
                  className={`text-xl font-bold ${
                    day.isToday ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {day.dayNumber}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Daily Progress Section */}
        <View className="px-6 mb-6">
          <Text className="text-white text-lg font-semibold mb-4">Daily Progress</Text>
          <View className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <View className="items-center mb-6">
              {/* Circular Progress Ring */}
              <Progress.Circle
                size={180}
                progress={progress}
                thickness={12}
                color="#10b981"
                unfilledColor="#334155"
                borderWidth={0}
                showsText={false}
                strokeCap="round"
              />
              <View className="absolute" style={{ top: 60 }}>
                <Text className="text-white text-4xl font-bold text-center">
                  {nutritionData.consumed}
                </Text>
                <Text className="text-slate-400 text-sm text-center">of {nutritionData.goal}</Text>
                <Text className="text-emerald-500 text-xs text-center mt-1">calories</Text>
              </View>
            </View>

            {/* Macros Summary */}
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <View className="bg-blue-500/20 rounded-full px-3 py-1 mb-2">
                  <Text className="text-blue-400 font-bold">{nutritionData.carbs}g</Text>
                </View>
                <Text className="text-slate-400 text-xs">Carbs</Text>
              </View>
              <View className="items-center flex-1">
                <View className="bg-emerald-500/20 rounded-full px-3 py-1 mb-2">
                  <Text className="text-emerald-400 font-bold">{nutritionData.protein}g</Text>
                </View>
                <Text className="text-slate-400 text-xs">Protein</Text>
              </View>
              <View className="items-center flex-1">
                <View className="bg-yellow-500/20 rounded-full px-3 py-1 mb-2">
                  <Text className="text-yellow-400 font-bold">{nutritionData.fat}g</Text>
                </View>
                <Text className="text-slate-400 text-xs">Fat</Text>
              </View>
            </View>

            {/* Remaining Calories */}
            <View className="mt-4 pt-4 border-t border-slate-700">
              <Text className="text-slate-400 text-sm text-center">
                <Text className="text-emerald-500 font-bold">{remaining} calories</Text> remaining today
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-6">
          <View className="flex-row space-x-3">
            <TouchableOpacity 
              onPress={() => router.push('/(tabs)/scanner')}
              className="flex-1"
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                className="rounded-2xl p-4 items-center"
                style={{ shadowColor: '#10b981', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}
              >
                <MaterialIcons name="photo-camera" size={28} color="#0f172a" />
                <Text className="text-slate-900 font-bold mt-2">Scan Food</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => router.push('/(tabs)/workout')}
              className="flex-1"
            >
              <View className="bg-slate-800 border border-slate-700 rounded-2xl p-4 items-center">
                <MaterialIcons name="fitness-center" size={28} color="#10b981" />
                <Text className="text-white font-bold mt-2">Log Workout</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Workouts */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-semibold">Upcoming Workouts</Text>
            <TouchableOpacity>
              <Text className="text-emerald-500 text-sm">View All</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-slate-800 border border-slate-700 rounded-2xl p-4 mb-3">
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row items-center">
                <View className="bg-emerald-500/20 rounded-full p-2 mr-3">
                  <MaterialIcons name="fitness-center" size={20} color="#10b981" />
                </View>
                <View>
                  <Text className="text-white font-bold">Upper Body Strength</Text>
                  <Text className="text-slate-400 text-xs">45 min • 8 exercises</Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#64748b" />
            </View>
            <View className="flex-row items-center mt-2">
              <MaterialIcons name="schedule" size={16} color="#64748b" />
              <Text className="text-slate-400 text-xs ml-1">Today, 4:00 PM</Text>
            </View>
          </View>

          <View className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row items-center">
                <View className="bg-blue-500/20 rounded-full p-2 mr-3">
                  <MaterialIcons name="directions-run" size={20} color="#3b82f6" />
                </View>
                <View>
                  <Text className="text-white font-bold">Cardio Session</Text>
                  <Text className="text-slate-400 text-xs">30 min • HIIT</Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#64748b" />
            </View>
            <View className="flex-row items-center mt-2">
              <MaterialIcons name="schedule" size={16} color="#64748b" />
              <Text className="text-slate-400 text-xs ml-1">Tomorrow, 6:30 AM</Text>
            </View>
          </View>
        </View>

        {/* Recent Scans */}
        <View className="px-6 mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-semibold">Recent Scans</Text>
            <TouchableOpacity>
              <Text className="text-emerald-500 text-sm">View All</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-slate-800 border border-slate-700 rounded-2xl p-4 mb-3">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center flex-1">
                <View className="bg-emerald-500/20 rounded-xl p-3 mr-3">
                  <MaterialIcons name="restaurant" size={24} color="#10b981" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold">Grilled Chicken Breast</Text>
                  <Text className="text-emerald-500 text-sm">285 cal • 53g Protein</Text>
                  <Text className="text-slate-400 text-xs mt-1">Lunch • 2 hours ago</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center flex-1">
                <View className="bg-yellow-500/20 rounded-xl p-3 mr-3">
                  <MaterialIcons name="local-dining" size={24} color="#eab308" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold">Banana Smoothie</Text>
                  <Text className="text-yellow-500 text-sm">180 cal • 42g Carbs</Text>
                  <Text className="text-slate-400 text-xs mt-1">Breakfast • 5 hours ago</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
    </SafeAreaView>
  );
}
