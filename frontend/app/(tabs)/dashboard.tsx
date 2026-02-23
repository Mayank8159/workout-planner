import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, SafeAreaView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'expo-router';
import { dataAPI } from '@/utils/api';

const { width } = Dimensions.get('window');

interface DayData {
  date: Date;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
}

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  date: string;
}

interface WorkoutItem {
  id: string;
  exercise: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  date: string;
}

export default function DashboardScreen() {
  const { user, isAuthenticated } = useUser();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState<DayData[]>([]);
  
  // Daily nutrition data
  const [nutritionData, setNutritionData] = useState({
    total_calories: 0,
    total_protein: 0,
    total_carbs: 0,
    total_fat: 0,
    total_fiber: 0,
    items: [],
  });

  // Workouts and scans
  const [upcomingWorkouts, setUpcomingWorkouts] = useState<WorkoutItem[]>([]);
  const [recentScans, setRecentScans] = useState<FoodItem[]>([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Daily calorie goal
  const dailyCalorieGoal = user?.dailyCalorieGoal || 2200;

  // Generate week days
  useEffect(() => {
    const generateWeek = () => {
      const days: DayData[] = [];
      const today = new Date();

      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
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

  // Fetch data for selected date
  useEffect(() => {
    const fetchDailyData = async () => {
      if (!isAuthenticated) {
        setError('Not authenticated');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const dateStr = selectedDate.toISOString().split('T')[0];
        const dailyData = await dataAPI.getDailyData(dateStr);

        // Update nutrition data
        if (dailyData?.nutrition) {
          setNutritionData({
            total_calories: dailyData.nutrition.total_calories || 0,
            total_protein: dailyData.nutrition.total_protein || 0,
            total_carbs: dailyData.nutrition.total_carbs || 0,
            total_fat: dailyData.nutrition.total_fat || 0,
            total_fiber: dailyData.nutrition.total_fiber || 0,
            items: dailyData.nutrition.items || [],
          });

          const scans = dailyData.nutrition.items || [];
          setRecentScans(scans.slice(-2).reverse());
        }

        // Update workouts
        if (dailyData?.workouts) {
          setUpcomingWorkouts(dailyData.workouts);
        }
      } catch (err: any) {
        console.error('Error fetching daily data:', err);
        setError(err?.response?.data?.detail || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyData();
  }, [selectedDate, isAuthenticated]);

  const progress = nutritionData.total_calories / dailyCalorieGoal;
  const remaining = Math.max(0, dailyCalorieGoal - nutritionData.total_calories);

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'N/A';
    }
  };

  const getTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor(diffMs / (1000 * 60));

      if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else if (diffMins > 0) {
        return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      } else {
        return 'Just now';
      }
    } catch {
      return 'Recently';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <LinearGradient colors={['#0f172a', '#1e293b']} className="flex-1">
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
                  <Text className={`text-xs mb-1 ${day.isToday ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                    {day.dayName}
                  </Text>
                  <Text className={`text-xl font-bold ${day.isToday ? 'text-slate-900' : 'text-white'}`}>
                    {day.dayNumber}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Loading State */}
          {isLoading ? (
            <View className="px-6 mb-6">
              <ActivityIndicator size="large" color="#10b981" />
              <Text className="text-slate-400 text-center mt-2">Loading your data...</Text>
            </View>
          ) : error ? (
            <View className="px-6 mb-6">
              <Text className="text-red-400 text-center">{error}</Text>
            </View>
          ) : (
            <>
              {/* Daily Progress Section */}
              <View className="px-6 mb-6">
                <Text className="text-white text-lg font-semibold mb-4">Daily Progress</Text>
                <View className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                  <View className="items-center mb-6">
                    <Progress.Circle
                      size={180}
                      progress={Math.min(progress, 1)}
                      thickness={12}
                      color="#10b981"
                      unfilledColor="#334155"
                      borderWidth={0}
                      showsText={false}
                      strokeCap="round"
                    />
                    <View className="absolute" style={{ top: 60 }}>
                      <Text className="text-white text-4xl font-bold text-center">
                        {nutritionData.total_calories}
                      </Text>
                      <Text className="text-slate-400 text-sm text-center">of {dailyCalorieGoal}</Text>
                      <Text className="text-emerald-500 text-xs text-center mt-1">calories</Text>
                    </View>
                  </View>

                  {/* Macros Summary */}
                  <View className="flex-row justify-between">
                    <View className="items-center flex-1">
                      <View className="bg-blue-500/20 rounded-full px-3 py-1 mb-2">
                        <Text className="text-blue-400 font-bold">{Math.round(nutritionData.total_carbs)}g</Text>
                      </View>
                      <Text className="text-slate-400 text-xs">Carbs</Text>
                    </View>
                    <View className="items-center flex-1">
                      <View className="bg-emerald-500/20 rounded-full px-3 py-1 mb-2">
                        <Text className="text-emerald-400 font-bold">{Math.round(nutritionData.total_protein)}g</Text>
                      </View>
                      <Text className="text-slate-400 text-xs">Protein</Text>
                    </View>
                    <View className="items-center flex-1">
                      <View className="bg-yellow-500/20 rounded-full px-3 py-1 mb-2">
                        <Text className="text-yellow-400 font-bold">{Math.round(nutritionData.total_fat)}g</Text>
                      </View>
                      <Text className="text-slate-400 text-xs">Fat</Text>
                    </View>
                  </View>

                  {/* Remaining Calories */}
                  <View className="mt-4 pt-4 border-t border-slate-700">
                    <Text className="text-slate-400 text-sm text-center">
                      <Text className="text-emerald-500 font-bold">{Math.round(remaining)} calories</Text> remaining today
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

              {/* Today's Workouts */}
              <View className="px-6 mb-6">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-white text-lg font-semibold">Today's Workouts</Text>
                  {upcomingWorkouts.length > 0 && (
                    <TouchableOpacity>
                      <Text className="text-emerald-500 text-sm">View All</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {upcomingWorkouts.length > 0 ? (
                  upcomingWorkouts.slice(0, 2).map((workout, index) => (
                    <View key={index} className="bg-slate-800 border border-slate-700 rounded-2xl p-4 mb-3">
                      <View className="flex-row justify-between items-center mb-2">
                        <View className="flex-row items-center">
                          <View className="bg-emerald-500/20 rounded-full p-2 mr-3">
                            <MaterialIcons name="fitness-center" size={20} color="#10b981" />
                          </View>
                          <View>
                            <Text className="text-white font-bold">{workout.exercise}</Text>
                            <Text className="text-slate-400 text-xs">
                              {workout.sets && workout.reps
                                ? `${workout.sets} sets × ${workout.reps} reps`
                                : workout.duration
                                ? `${workout.duration} min`
                                : 'Completed'}
                            </Text>
                          </View>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color="#64748b" />
                      </View>
                      <View className="flex-row items-center mt-2">
                        <MaterialIcons name="schedule" size={16} color="#64748b" />
                        <Text className="text-slate-400 text-xs ml-1">{formatTime(workout.date)}</Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View className="bg-slate-800 border border-slate-700 rounded-2xl p-4 items-center py-6">
                    <MaterialIcons name="fitness-center" size={32} color="#64748b" />
                    <Text className="text-slate-400 text-center mt-2">No workouts logged today</Text>
                  </View>
                )}
              </View>

              {/* Recent Scans */}
              <View className="px-6 mb-8">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-white text-lg font-semibold">Recent Scans</Text>
                  {recentScans.length > 0 && (
                    <TouchableOpacity>
                      <Text className="text-emerald-500 text-sm">View All</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {recentScans.length > 0 ? (
                  recentScans.map((scan, index) => (
                    <View key={index} className="bg-slate-800 border border-slate-700 rounded-2xl p-4 mb-3">
                      <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center flex-1">
                          <View className="bg-emerald-500/20 rounded-xl p-3 mr-3">
                            <MaterialIcons name="restaurant" size={24} color="#10b981" />
                          </View>
                          <View className="flex-1">
                            <Text className="text-white font-bold capitalize">{scan.name.replace(/_/g, ' ')}</Text>
                            <Text className="text-emerald-500 text-sm">
                              {scan.calories} cal • {Math.round(scan.protein)}g Protein
                            </Text>
                            <Text className="text-slate-400 text-xs mt-1">{getTimeAgo(scan.date)}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))
                ) : (
                  <View className="bg-slate-800 border border-slate-700 rounded-2xl p-4 items-center py-6">
                    <MaterialIcons name="restaurant" size={32} color="#64748b" />
                    <Text className="text-slate-400 text-center mt-2">No food scans yet</Text>
                  </View>
                )}
              </View>
            </>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
