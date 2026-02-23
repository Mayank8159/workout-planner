import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useUser } from '@/context/UserContext';
import { API_BASE_URL } from '@/utils/api';
import { secureStorage } from '@/utils/secureStorage';

interface DailyData {
  workouts: Array<{
    id: string;
    exercise: string;
    sets: number;
    reps: number;
    weight: number;
    duration: number;
    date: string;
  }>;
  nutrition: {
    totalCalories: number;
    items: Array<{
      id: string;
      name: string;
      calories: number;
      date: string;
    }>;
  };
}

export default function CalendarDashboard() {
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [dailyData, setDailyData] = useState<DailyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [markedDates, setMarkedDates] = useState<any>({});

  // Fetch data for selected date
  useEffect(() => {
    fetchDailyData();
  }, [selectedDate]);

  const fetchDailyData = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const token = await secureStorage.getToken();
      const response = await axios.get(
        `${API_BASE_URL}/data/${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDailyData(response.data);

      // Mark dates that have data
      setMarkedDates((prev: any) => ({
        ...prev,
        [selectedDate]: {
          selected: true,
          selectedColor: '#3b82f6',
          selectedTextColor: '#fff',
        },
      }));
    } catch (error) {
      console.error('Failed to fetch daily data:', error);
      setDailyData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLogPrompt = () => {
    Alert.alert(
      'No logs found',
      'Would you like to add a workout or log some food?',
      [
        { text: 'Cancel', onPress: () => {} },
        { text: 'Log Workout', onPress: () => {} },
        { text: 'Log Food', onPress: () => {} },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-dark-bg">
      <View className="px-6 pt-8 pb-8">
        <Text className="text-3xl font-bold text-cyan-400 mb-8">Calendar</Text>

        {/* Calendar Widget */}
        <View style={{
          backgroundColor: 'rgba(26, 31, 58, 0.5)',
          borderRadius: 16,
          padding: 16,
          marginBottom: 32,
          borderWidth: 1,
          borderColor: 'rgba(168, 85, 247, 0.2)',
          shadowColor: '#a855f7',
          shadowOpacity: 0.3,
          shadowRadius: 10,
        }}>
          <Calendar
            current={selectedDate}
            minDate="2020-01-01"
            maxDate="2030-12-31"
            onDayPress={(day: any) => setSelectedDate(day.dateString)}
            markedDates={{
              ...markedDates,
              [selectedDate]: {
                selected: true,
                selectedColor: '#a855f7',
                selectedTextColor: '#ffffff',
              },
            }}
            theme={{
              backgroundColor: 'transparent',
              calendarBackground: 'transparent',
              textSectionTitleColor: '#06b6d4',
              selectedDayBackgroundColor: '#a855f7',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#06b6d4',
              todayBackgroundColor: 'transparent',
              dayTextColor: '#e5e7eb',
              textDisabledColor: '#4b5563',
              dotColor: '#a855f7',
              selectedDotColor: '#ffffff',
              arrowColor: '#a855f7',
              monthTextColor: '#06b6d4',
              textMonthFontWeight: 'bold',
            }}
          />
        </View>

        {loading ? (
          <View className="items-center justify-center py-8">
            <ActivityIndicator size="large" color="#a855f7" />
            <Text className="text-cyan-300 mt-2">Loading data...</Text>
          </View>
        ) : dailyData && (dailyData.workouts.length > 0 || dailyData.nutrition.items.length > 0) ? (
          <>
            {/* Daily Workouts Section */}
            {dailyData.workouts.length > 0 && (
              <View className="mb-8">
                <Text className="text-xl font-bold text-cyan-400 mb-4">
                  Daily Workouts
                </Text>
                {dailyData.workouts.map((workout) => (
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
                          {new Date(workout.date).toLocaleString()}
                        </Text>
                      </View>
                      <MaterialIcons
                        name="fitness-center"
                        size={24}
                        color="#06b6d4"
                      />
                    </View>
                    <View className="flex-row justify-between mt-3">
                      <Text className="text-cyan-300">
                        {workout.sets}×{workout.reps}
                      </Text>
                      <Text className="text-cyan-300">{workout.weight} lbs</Text>
                      <Text className="text-cyan-300">{workout.duration} min</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Nutrition Summary Section */}
            {dailyData.nutrition.items.length > 0 && (
              <View className="mb-8">
                <Text className="text-xl font-bold text-cyan-400 mb-4">
                  Nutrition Summary
                </Text>

                {/* Calorie Total */}
                <View style={{
                  backgroundColor: 'rgba(168, 85, 247, 0.4)',
                  borderRadius: 12,
                  padding: 24,
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: 'rgba(168, 85, 247, 0.3)',
                  shadowColor: '#a855f7',
                  shadowOpacity: 0.5,
                  shadowRadius: 15,
                }}>
                  <Text className="text-cyan-300 text-sm mb-2">
                    Total Calories
                  </Text>
                  <View className="flex-row items-baseline gap-2">
                    <Text className="text-cyan-400 text-4xl font-bold">
                      {dailyData.nutrition.totalCalories}
                    </Text>
                    <Text className="text-cyan-300 text-lg">kcal</Text>
                  </View>
                </View>

                {/* Food Items List */}
                <Text className="text-white font-semibold mb-3">Food Items</Text>
                {dailyData.nutrition.items.map((item) => (
                  <View
                    key={item.id}
                    style={{
                      backgroundColor: 'rgba(26, 31, 58, 0.5)',
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 8,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: 'rgba(6, 182, 212, 0.3)',
                      shadowColor: '#06b6d4',
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                    }}
                  >
                    <View className="flex-1">
                      <Text className="text-white font-medium">{item.name}</Text>
                      <Text className="text-cyan-400 text-sm">
                        {new Date(item.date).toLocaleTimeString()}
                      </Text>
                    </View>
                    <Text className="text-cyan-400 font-bold">
                      {item.calories} cal
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </>
        ) : (
          // Empty State
          <View style={{
            backgroundColor: 'rgba(26, 31, 58, 0.5)',
            borderRadius: 12,
            padding: 32,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'rgba(168, 85, 247, 0.2)',
            shadowColor: '#a855f7',
            shadowOpacity: 0.3,
            shadowRadius: 10,
          }}>
            <MaterialIcons
              name="assignment"
              size={48}
              color="#06b6d4"
              style={{ marginBottom: 16 }}
            />
            <Text className="text-cyan-300 text-center mb-4">
              No logs found for {selectedDate}
            </Text>
            <TouchableOpacity
              onPress={handleAddLogPrompt}
              style={{
                backgroundColor: 'rgba(168, 85, 247, 0.8)',
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 24,
                shadowColor: '#a855f7',
                shadowOpacity: 0.6,
                shadowRadius: 10,
              }}
            >
              <Text className="text-white font-bold text-center">
                Add one?
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
