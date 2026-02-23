import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';

const { width } = Dimensions.get('window');

interface MacroData {
  carbs: number;
  protein: number;
  fat: number;
}

interface ScanResultModalProps {
  visible: boolean;
  onClose: () => void;
  onAddToLog: () => void;
  foodName: string;
  calories: number;
  macros: MacroData;
  confidence?: number;
  loading?: boolean;
}

export const ScanResultModal: React.FC<ScanResultModalProps> = ({
  visible,
  onClose,
  onAddToLog,
  foodName,
  calories,
  macros,
  confidence = 0,
  loading = false,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-slate-900 rounded-t-3xl" style={{ maxHeight: '80%' }}>
          <ScrollView>
            {/* Header */}
            <View className="px-6 pt-6 pb-4 border-b border-slate-700">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <View className="bg-emerald-500/20 rounded-full p-2 mr-3">
                    <MaterialIcons name="restaurant" size={24} color="#10b981" />
                  </View>
                  <Text className="text-white text-xl font-bold">Scan Result</Text>
                </View>
                <TouchableOpacity onPress={onClose} className="bg-slate-800 rounded-full p-2">
                  <MaterialIcons name="close" size={20} color="#64748b" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Food Name */}
            <View className="px-6 py-4">
              <Text className="text-slate-400 text-sm mb-1">Food Item</Text>
              <Text className="text-white text-2xl font-bold">{foodName}</Text>
              {confidence > 0 && (
                <View className="flex-row items-center mt-2">
                  <Progress.Bar
                    progress={confidence}
                    width={100}
                    height={6}
                    color="#10b981"
                    unfilledColor="#334155"
                    borderWidth={0}
                  />
                  <Text className="text-emerald-500 text-xs ml-2 font-semibold">
                    {Math.round(confidence * 100)}% confidence
                  </Text>
                </View>
              )}
            </View>

            {/* Calorie Count */}
            <View className="px-6 py-4 bg-slate-800/50">
              <View className="items-center py-4">
                <Text className="text-slate-400 text-sm mb-2">Total Calories</Text>
                <View className="flex-row items-baseline">
                  <Text className="text-emerald-500 text-5xl font-bold">{calories}</Text>
                  <Text className="text-slate-400 text-xl ml-2">kcal</Text>
                </View>
              </View>
            </View>

            {/* Macronutrient Breakdown */}
            <View className="px-6 py-6">
              <Text className="text-white text-lg font-semibold mb-4">Macronutrients</Text>
              
              {/* Carbs */}
              <View className="mb-4">
                <View className="flex-row justify-between items-center mb-2">
                  <View className="flex-row items-center">
                    <View className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                    <Text className="text-slate-300">Carbohydrates</Text>
                  </View>
                  <Text className="text-white font-bold">{macros.carbs}g</Text>
                </View>
                <Progress.Bar
                  progress={macros.carbs / 100}
                  width={width - 48}
                  height={8}
                  color="#3b82f6"
                  unfilledColor="#334155"
                  borderWidth={0}
                  borderRadius={4}
                />
              </View>

              {/* Protein */}
              <View className="mb-4">
                <View className="flex-row justify-between items-center mb-2">
                  <View className="flex-row items-center">
                    <View className="w-3 h-3 rounded-full bg-emerald-500 mr-2" />
                    <Text className="text-slate-300">Protein</Text>
                  </View>
                  <Text className="text-white font-bold">{macros.protein}g</Text>
                </View>
                <Progress.Bar
                  progress={macros.protein / 100}
                  width={width - 48}
                  height={8}
                  color="#10b981"
                  unfilledColor="#334155"
                  borderWidth={0}
                  borderRadius={4}
                />
              </View>

              {/* Fat */}
              <View className="mb-4">
                <View className="flex-row justify-between items-center mb-2">
                  <View className="flex-row items-center">
                    <View className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                    <Text className="text-slate-300">Fat</Text>
                  </View>
                  <Text className="text-white font-bold">{macros.fat}g</Text>
                </View>
                <Progress.Bar
                  progress={macros.fat / 50}
                  width={width - 48}
                  height={8}
                  color="#eab308"
                  unfilledColor="#334155"
                  borderWidth={0}
                  borderRadius={4}
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View className="px-6 pb-8">
              <TouchableOpacity
                onPress={onAddToLog}
                disabled={loading}
                className="mb-3"
              >
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  className="rounded-2xl py-4 items-center flex-row justify-center"
                  style={{ shadowColor: '#10b981', shadowOpacity: 0.4, shadowRadius: 10, elevation: 5 }}
                >
                  <MaterialIcons name="add-circle" size={24} color="#0f172a" />
                  <Text className="text-slate-900 text-lg font-bold ml-2">Add to Daily Log</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                className="bg-slate-800 border border-slate-700 rounded-2xl py-4 items-center"
              >
                <Text className="text-white text-lg font-semibold">Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
