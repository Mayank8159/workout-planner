import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import axios from 'axios';
import { useUser } from '@/context/UserContext';
import { API_BASE_URL } from '@/utils/api';
import { secureStorage } from '@/utils/secureStorage';

interface TodayStats {
  caloriesConsumed: number;
  workoutCount: number;
  totalDuration: number;
}

export default function ProfileScreen() {
  const { user, logout } = useUser();
  const [todayStats, setTodayStats] = useState<TodayStats>({
    caloriesConsumed: 0,
    workoutCount: 0,
    totalDuration: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetchTodayStats();
  }, []);

  const fetchTodayStats = async () => {
    try {
      const token = await secureStorage.getToken();
      const today = new Date().toISOString().split('T')[0];

      const response = await axios.get(
        `${API_BASE_URL}/data/${today}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTodayStats({
        caloriesConsumed: response.data.nutrition.totalCalories || 0,
        workoutCount: response.data.workouts.length || 0,
        totalDuration:
          response.data.workouts.reduce((sum: number, w: any) => sum + w.duration, 0) || 0,
      });
    } catch (error) {
      console.error('Failed to fetch today stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Logout',
          onPress: async () => {
            setLoggingOut(true);
            try {
              await logout();
              // Navigation will be handled by the app's auth flow
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            } finally {
              setLoggingOut(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const calorieProgress =
    user?.dailyCalorieGoal && user.dailyCalorieGoal > 0
      ? Math.min(todayStats.caloriesConsumed / user.dailyCalorieGoal, 1.0)
      : 0;

  const caloriePercentage = Math.round(calorieProgress * 100);

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <ScrollView className="flex-1 bg-dark-bg" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-6 pt-6 pb-8">
          {/* Header with user avatar */}
          <View className="flex-row items-center mb-8">
            <View style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: 'rgba(168, 85, 247, 0.3)',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16,
              borderWidth: 2,
              borderColor: 'rgba(168, 85, 247, 0.6)',
              shadowColor: '#a855f7',
              shadowOpacity: 0.6,
              shadowRadius: 12,
            }}>
              <MaterialIcons name="person" size={32} color="#06b6d4" />
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-cyan-400">
                {user?.username || 'User'}
            </Text>
            <Text className="text-cyan-300 text-sm">{user?.email}</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-cyan-400 mb-4">Today's Stats</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#a855f7" />
          ) : (
            <>
              {/* Calorie Goal Progress */}
              <View style={{
                backgroundColor: 'rgba(26, 31, 58, 0.5)',
                borderRadius: 12,
                padding: 24,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: 'rgba(6, 182, 212, 0.3)',
                shadowColor: '#06b6d4',
                shadowOpacity: 0.4,
                shadowRadius: 10,
              }}>
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-white font-semibold">
                    Calorie Goal
                  </Text>
                  <Text className="text-cyan-400 text-sm">
                    {caloriePercentage}%
                  </Text>
                </View>
                <Progress.Bar
                  progress={calorieProgress}
                  width={null}
                  height={12}
                  color="#06b6d4"
                  unfilledColor="rgba(26, 31, 58, 0.8)"
                  borderWidth={0}
                  className="mb-2"
                />
                <View className="flex-row justify-between">
                  <Text className="text-cyan-300 text-xs">
                    {todayStats.caloriesConsumed} kcal consumed
                  </Text>
                  <Text className="text-cyan-300 text-xs">
                    Goal: {user?.dailyCalorieGoal || 2000} kcal
                  </Text>
                </View>
              </View>

              {/* Workouts Today */}
              <View style={{
                backgroundColor: 'rgba(26, 31, 58, 0.5)',
                borderRadius: 12,
                padding: 24,
                marginBottom: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderWidth: 1,
                borderColor: 'rgba(168, 85, 247, 0.3)',
                shadowColor: '#a855f7',
                shadowOpacity: 0.4,
                shadowRadius: 10,
              }}>
                <View className="flex-row items-center gap-3">
                  <MaterialIcons
                    name="fitness-center"
                    size={24}
                    color="#06b6d4"
                  />
                  <View>
                    <Text className="text-cyan-300 text-xs">
                      Workouts Today
                    </Text>
                    <Text className="text-white text-2xl font-bold">
                      {todayStats.workoutCount}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text className="text-cyan-300 text-xs">Duration</Text>
                  <Text className="text-white text-xl font-bold">
                    {todayStats.totalDuration} min
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Account Info */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-cyan-400 mb-4">
            Account Info
          </Text>

          <View style={{
            backgroundColor: 'rgba(26, 31, 58, 0.5)',
            borderRadius: 12,
            padding: 24,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: 'rgba(14, 165, 233, 0.2)',
            shadowColor: '#0ea5e9',
            shadowOpacity: 0.3,
            shadowRadius: 10,
          }}>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-cyan-300">Workout Streak</Text>
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="local-fire-department" size={20} color="#ec4899" />
                <Text className="text-white font-bold text-lg">
                  {user?.workoutStreak || 0} days
                </Text>
              </View>
            </View>

            <View style={{
              borderTopWidth: 1,
              borderTopColor: 'rgba(168, 85, 247, 0.2)',
            }} className="flex-row items-center justify-between mb-4 pt-4">
              <Text className="text-cyan-300">Daily Goal</Text>
              <Text className="text-white font-bold">
                {user?.dailyCalorieGoal || 2000} kcal
              </Text>
            </View>

            <View style={{
              borderTopWidth: 1,
              borderTopColor: 'rgba(168, 85, 247, 0.2)',
            }} className="flex-row items-center justify-between pt-4">
              <Text className="text-cyan-300">Member Since</Text>
              <Text className="text-white font-bold">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mb-8">
          <TouchableOpacity
            onPress={() => {}}
            style={{
              backgroundColor: 'rgba(26, 31, 58, 0.5)',
              borderRadius: 12,
              paddingVertical: 16,
              paddingHorizontal: 24,
              marginBottom: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderWidth: 1,
              borderColor: 'rgba(168, 85, 247, 0.2)',
            }}
          >
            <Text className="text-cyan-400 font-semibold">Settings</Text>
            <MaterialIcons name="chevron-right" size={24} color="#a855f7" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {}}
            style={{
              backgroundColor: 'rgba(26, 31, 58, 0.5)',
              borderRadius: 12,
              paddingVertical: 16,
              paddingHorizontal: 24,
              marginBottom: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderWidth: 1,
              borderColor: 'rgba(168, 85, 247, 0.2)',
            }}
          >
            <Text className="text-cyan-400 font-semibold">About</Text>
            <MaterialIcons name="chevron-right" size={24} color="#a855f7" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          disabled={loggingOut}
          style={{
            backgroundColor: 'rgba(236, 72, 153, 0.7)',
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'rgba(236, 72, 153, 0.4)',
            shadowColor: '#ec4899',
            shadowOpacity: 0.5,
            shadowRadius: 10,
          }}
        >
          {loggingOut ? (
            <ActivityIndicator color="white" />
          ) : (
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="logout" size={20} color="white" />
              <Text className="text-white font-bold text-lg">Logout</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
