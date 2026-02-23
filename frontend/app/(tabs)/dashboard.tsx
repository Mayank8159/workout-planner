import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, SafeAreaView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
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
  const proteinGoal = user?.proteinGoal || 150;
  const carbsGoal = user?.carbsGoal || 200;
  const fiberGoal = user?.fiberGoal || 25;

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
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 140, paddingTop: 12 }}>
          {/* Professional Header with Gradient Background */}
          <LinearGradient
            colors={['rgba(59, 130, 246, 0.15)', 'rgba(15, 23, 42, 0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}>
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-slate-400 text-sm font-semibold">Welcome back</Text>
                <Text className="text-white text-4xl font-900 mt-1">{user?.username || 'User'}</Text>
                <Text className="text-slate-400 text-xs mt-2">Let's crush your goals today</Text>
              </View>
              <TouchableOpacity
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: 'rgba(96, 165, 250, 0.15)',
                  borderWidth: 1,
                  borderColor: 'rgba(96, 165, 250, 0.3)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <MaterialIcons name="notifications-none" size={22} color="#60a5fa" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Weekly Calendar Strip */}
          <View style={{ paddingHorizontal: 20, marginBottom: 28, marginTop: 12 }}>
            <View className="flex-row items-center mb-4">
              <MaterialIcons name="calendar-today" size={18} color="#60a5fa" style={{ marginRight: 8 }} />
              <Text className="text-white text-lg font-bold">This Week</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row" style={{ marginHorizontal: -20 }}>
              <View style={{ paddingHorizontal: 20, flexDirection: 'row', gap: 8 }}>
                {weekDays.map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedDate(day.date)}
                    style={{
                      minWidth: 70,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      borderWidth: 1.5,
                    }}
                    className={
                      day.isToday
                        ? ''
                        : selectedDate.toDateString() === day.date.toDateString()
                        ? 'bg-slate-700 border-slate-600'
                        : 'bg-slate-800/50 border-slate-700'
                    }>
                    {day.isToday ? (
                      <LinearGradient
                        colors={['rgba(96, 165, 250, 0.3)', 'rgba(59, 130, 246, 0.15)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          borderRadius: 12,
                          borderWidth: 1.5,
                          borderColor: 'rgba(96, 165, 250, 0.4)',
                        }}
                      />
                    ) : null}
                    <Text
                      className={`text-xs mb-1 font-bold ${
                        day.isToday ? 'text-blue-300' : 'text-slate-400'
                      }`}>
                      {day.dayName}
                    </Text>
                    <Text className={`text-lg font-bold ${day.isToday ? 'text-blue-300' : 'text-white'}`}>
                      {day.dayNumber}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Loading State */}
          {isLoading ? (
            <View style={{ paddingHorizontal: 20, marginBottom: 24, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#60a5fa" />
              <Text className="text-slate-400 text-center mt-3">Loading your data...</Text>
            </View>
          ) : error ? (
            <LinearGradient
              colors={['rgba(239, 68, 68, 0.15)', 'rgba(239, 68, 68, 0.05)']}
              style={{
                marginHorizontal: 20,
                marginBottom: 24,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: 'rgba(239, 68, 68, 0.3)',
              }}>
              <Text className="text-red-300 text-center text-sm">{error}</Text>
            </LinearGradient>
          ) : (
            <>
              {/* Daily Progress Section */}
              <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
                <View className="flex-row items-center mb-4">
                  <MaterialIcons name="trending-up" size={20} color="#60a5fa" style={{ marginRight: 8 }} />
                  <Text className="text-white text-lg font-bold">Daily Progress</Text>
                </View>
                <LinearGradient
                  colors={['rgba(51, 65, 85, 0.4)', 'rgba(51, 65, 85, 0.15)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 16,
                    padding: 24,
                    borderWidth: 1,
                    borderColor: 'rgba(148, 163, 184, 0.2)',
                  }}>
                  <View className="items-center mb-8">
                    <Progress.Circle
                      size={160}
                      progress={Math.min(progress, 1)}
                      thickness={10}
                      color="#60a5fa"
                      unfilledColor="rgba(148, 163, 184, 0.2)"
                      borderWidth={0}
                      showsText={false}
                      strokeCap="round"
                    />
                    <View className="absolute" style={{ top: 45 }}>
                      <Text className="text-white text-4xl font-900 text-center">
                        {nutritionData.total_calories}
                      </Text>
                      <Text className="text-slate-400 text-xs text-center mt-1">
                        <Text className="font-bold">{dailyCalorieGoal}</Text> cal goal
                      </Text>
                    </View>
                  </View>

                  {/* Macros Grid */}
                  <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
                    {/* Carbs */}
                    <LinearGradient
                      colors={['rgba(96, 165, 250, 0.15)', 'rgba(59, 130, 246, 0.08)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        flex: 1,
                        borderRadius: 12,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: 'rgba(96, 165, 250, 0.2)',
                      }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <MaterialIcons name="grain" size={16} color="#60a5fa" />
                        <Text className="text-blue-300 font-bold text-xs ml-1">Carbs</Text>
                      </View>
                      <Text className="text-white font-bold text-sm">{Math.round(nutritionData.total_carbs)}g</Text>
                      <Text className="text-slate-400 text-xs mt-1">Goal: {carbsGoal}g</Text>
                      <Progress.Bar
                        progress={Math.min(nutritionData.total_carbs / carbsGoal, 1)}
                        width={null}
                        height={4}
                        borderRadius={2}
                        color="#60a5fa"
                        unfilledColor="rgba(96, 165, 250, 0.2)"
                        borderWidth={0}
                        style={{ marginTop: 8 }}
                      />
                    </LinearGradient>

                    {/* Protein */}
                    <LinearGradient
                      colors={['rgba(168, 85, 247, 0.15)', 'rgba(139, 92, 246, 0.08)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        flex: 1,
                        borderRadius: 12,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: 'rgba(168, 85, 247, 0.2)',
                      }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <MaterialIcons name="local-fire-department" size={16} color="#c084fc" />
                        <Text className="text-purple-300 font-bold text-xs ml-1">Protein</Text>
                      </View>
                      <Text className="text-white font-bold text-sm">{Math.round(nutritionData.total_protein)}g</Text>
                      <Text className="text-slate-400 text-xs mt-1">Goal: {proteinGoal}g</Text>
                      <Progress.Bar
                        progress={Math.min(nutritionData.total_protein / proteinGoal, 1)}
                        width={null}
                        height={4}
                        borderRadius={2}
                        color="#c084fc"
                        unfilledColor="rgba(168, 85, 247, 0.2)"
                        borderWidth={0}
                        style={{ marginTop: 8 }}
                      />
                    </LinearGradient>

                    {/* Fat */}
                    <LinearGradient
                      colors={['rgba(249, 115, 22, 0.15)', 'rgba(217, 119, 6, 0.08)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        flex: 1,
                        borderRadius: 12,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: 'rgba(249, 115, 22, 0.2)',
                      }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <MaterialIcons name="opacity" size={16} color="#f97316" />
                        <Text className="text-orange-300 font-bold text-xs ml-1">Fat</Text>
                      </View>
                      <Text className="text-white font-bold text-sm">{Math.round(nutritionData.total_fat)}g</Text>
                      <Text className="text-slate-400 text-xs mt-1">~70g</Text>
                      <Progress.Bar
                        progress={Math.min(nutritionData.total_fat / 70, 1)}
                        width={null}
                        height={4}
                        borderRadius={2}
                        color="#f97316"
                        unfilledColor="rgba(249, 115, 22, 0.2)"
                        borderWidth={0}
                        style={{ marginTop: 8 }}
                      />
                    </LinearGradient>
                  </View>

                  {/* Fiber Goal */}
                  <LinearGradient
                    colors={['rgba(34, 197, 94, 0.15)', 'rgba(22, 163, 74, 0.08)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: 12,
                      padding: 12,
                      marginBottom: 16,
                      borderWidth: 1,
                      borderColor: 'rgba(34, 197, 94, 0.2)',
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <MaterialIcons name="local-dining" size={16} color="#22c55e" />
                      <Text className="text-green-300 font-bold text-xs ml-1">Fiber</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <View>
                        <Text className="text-white font-bold text-sm">{Math.round(nutritionData.total_fiber)}g</Text>
                        <Text className="text-slate-400 text-xs">Goal: {fiberGoal}g</Text>
                      </View>
                      <Text className="text-slate-400 text-xs">{Math.round((nutritionData.total_fiber / fiberGoal) * 100)}%</Text>
                    </View>
                    <Progress.Bar
                      progress={Math.min(nutritionData.total_fiber / fiberGoal, 1)}
                      width={null}
                      height={4}
                      borderRadius={2}
                      color="#22c55e"
                      unfilledColor="rgba(34, 197, 94, 0.2)"
                      borderWidth={0}
                    />
                  </LinearGradient>

                  {/* Remaining Calories */}
                  <View
                    style={{
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      borderRadius: 10,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      borderWidth: 1,
                      borderColor: 'rgba(34, 197, 94, 0.2)',
                    }}>
                    <View className="flex-row items-center justify-center">
                      <MaterialIcons name="check-circle" size={16} color="#22c55e" />
                      <Text className="text-green-300 text-sm font-bold ml-2">
                        {Math.round(remaining)} calories remaining
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>

              {/* Quick Actions */}
              <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => router.push('/(tabs)/scanner')}
                    className="flex-1"
                    activeOpacity={0.8}>
                    <LinearGradient
                      colors={['rgba(96, 165, 250, 0.3)', 'rgba(59, 130, 246, 0.15)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        borderRadius: 14,
                        paddingVertical: 14,
                        alignItems: 'center',
                        borderWidth: 1.5,
                        borderColor: 'rgba(96, 165, 250, 0.4)',
                      }}>
                      <MaterialIcons name="photo-camera" size={24} color="#60a5fa" />
                      <Text className="text-blue-300 font-bold mt-2">Scan Food</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => router.push('/(tabs)/workout')}
                    className="flex-1"
                    activeOpacity={0.8}>
                    <LinearGradient
                      colors={['rgba(168, 85, 247, 0.3)', 'rgba(139, 92, 246, 0.15)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        borderRadius: 14,
                        paddingVertical: 14,
                        alignItems: 'center',
                        borderWidth: 1.5,
                        borderColor: 'rgba(168, 85, 247, 0.4)',
                      }}>
                      <MaterialIcons name="fitness-center" size={24} color="#c084fc" />
                      <Text className="text-purple-300 font-bold mt-2">Log Workout</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Today's Workouts */}
              <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
                <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-row items-center">
                    <MaterialIcons name="fitness-center" size={20} color="#c084fc" style={{ marginRight: 8 }} />
                    <Text className="text-white text-lg font-bold">Today's Workouts</Text>
                  </View>
                  {upcomingWorkouts.length > 0 && (
                    <TouchableOpacity onPress={() => router.push('/(tabs)/workout')}>
                      <Text className="text-purple-300 text-xs font-bold">View All</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {upcomingWorkouts.length > 0 ? (
                  upcomingWorkouts.slice(0, 2).map((workout, index) => (
                    <LinearGradient
                      key={index}
                      colors={['rgba(168, 85, 247, 0.1)', 'rgba(139, 92, 246, 0.05)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        borderRadius: 12,
                        padding: 14,
                        marginBottom: 10,
                        borderWidth: 1,
                        borderColor: 'rgba(168, 85, 247, 0.2)',
                      }}>
                      <View className="flex-row justify-between items-start">
                        <View className="flex-row items-center flex-1">
                          <View
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 10,
                              backgroundColor: 'rgba(168, 85, 247, 0.2)',
                              justifyContent: 'center',
                              alignItems: 'center',
                              marginRight: 12,
                            }}>
                            <MaterialIcons name="fitness-center" size={18} color="#c084fc" />
                          </View>
                          <View className="flex-1">
                            <Text className="text-white font-bold">{workout.exercise}</Text>
                            <Text className="text-slate-400 text-xs mt-1">
                              {workout.sets && workout.reps
                                ? `${workout.sets} sets × ${workout.reps} reps`
                                : workout.duration
                                ? `${workout.duration} min`
                                : 'Completed'}
                            </Text>
                            <View className="flex-row items-center mt-2">
                              <MaterialIcons name="schedule" size={14} color="#64748b" />
                              <Text className="text-slate-400 text-xs ml-1">{formatTime(workout.date)}</Text>
                            </View>
                          </View>
                        </View>
                        <View
                          style={{
                            backgroundColor: 'rgba(168, 85, 247, 0.15)',
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 6,
                          }}>
                          <Text className="text-purple-300 font-bold text-xs">Done</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  ))
                ) : (
                  <LinearGradient
                    colors={['rgba(148, 163, 184, 0.1)', 'rgba(148, 163, 184, 0.05)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: 12,
                      paddingVertical: 24,
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: 'rgba(148, 163, 184, 0.15)',
                    }}>
                    <MaterialIcons name="fitness-center" size={32} color="#64748b" />
                    <Text className="text-slate-400 text-center mt-2 text-sm">No workouts logged today</Text>
                  </LinearGradient>
                )}
              </View>

              {/* Recent Scans */}
              <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
                <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-row items-center">
                    <MaterialIcons name="restaurant" size={20} color="#f97316" style={{ marginRight: 8 }} />
                    <Text className="text-white text-lg font-bold">Recent Scans</Text>
                  </View>
                  {recentScans.length > 0 && (
                    <TouchableOpacity>
                      <Text className="text-orange-300 text-xs font-bold">View All</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {recentScans.length > 0 ? (
                  recentScans.map((scan, index) => (
                    <LinearGradient
                      key={index}
                      colors={['rgba(249, 115, 22, 0.1)', 'rgba(217, 119, 6, 0.05)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        borderRadius: 12,
                        padding: 14,
                        marginBottom: 10,
                        borderWidth: 1,
                        borderColor: 'rgba(249, 115, 22, 0.2)',
                      }}>
                      <View className="flex-row justify-between items-start">
                        <View className="flex-row items-center flex-1">
                          <View
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 10,
                              backgroundColor: 'rgba(249, 115, 22, 0.2)',
                              justifyContent: 'center',
                              alignItems: 'center',
                              marginRight: 12,
                            }}>
                            <MaterialIcons name="restaurant" size={18} color="#f97316" />
                          </View>
                          <View className="flex-1">
                            <Text className="text-white font-bold capitalize">{scan.name.replace(/_/g, ' ')}</Text>
                            <Text className="text-slate-400 text-xs mt-1">
                              {scan.calories} cal • {Math.round(scan.protein)}g Protein
                            </Text>
                            <Text className="text-slate-500 text-xs mt-1">{getTimeAgo(scan.date)}</Text>
                          </View>
                        </View>
                        <View
                          style={{
                            backgroundColor: 'rgba(249, 115, 22, 0.15)',
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 6,
                          }}>
                          <Text className="text-orange-300 font-bold text-xs">{Math.round(scan.calories)} cal</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  ))
                ) : (
                  <LinearGradient
                    colors={['rgba(148, 163, 184, 0.1)', 'rgba(148, 163, 184, 0.05)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: 12,
                      paddingVertical: 24,
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: 'rgba(148, 163, 184, 0.15)',
                    }}>
                    <MaterialIcons name="restaurant" size={32} color="#64748b" />
                    <Text className="text-slate-400 text-center mt-2 text-sm">No food scans yet</Text>
                  </LinearGradient>
                )}
              </View>
            </>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
