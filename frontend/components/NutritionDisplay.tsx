import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface NutritionData {
  total_calories?: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
  total_fiber?: number;
  items?: FoodItem[];
}

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  confidence: number;
  date: string;
}

interface NutritionDisplayProps {
  nutrition: NutritionData;
  date: string;
}

const NutritionDisplay: React.FC<NutritionDisplayProps> = ({ nutrition, date }) => {
  const calories = nutrition.total_calories || 0;
  const protein = nutrition.total_protein || 0;
  const carbs = nutrition.total_carbs || 0;
  const fat = nutrition.total_fat || 0;
  const fiber = nutrition.total_fiber || 0;
  const items = nutrition.items || [];

  // Daily nutrition goals (can be customized per user)
  const goals = {
    calories: 2000,
    protein: 50,
    carbs: 300,
    fat: 65,
    fiber: 25,
  };

  const getProgressPercentage = (current: number, goal: number): number => {
    return Math.min((current / goal) * 100, 100);
  };

  const getMacroColor = (macro: string): string[] => {
    switch (macro) {
      case 'protein':
        return ['#FF6B6B', '#EE5A6F'];
      case 'carbs':
        return ['#4ECDC4', '#45B7B0'];
      case 'fat':
        return ['#FFE66D', '#F9D56E'];
      case 'fiber':
        return ['#95E1D3', '#7BDCC4'];
      default:
        return ['#A29BFE', '#9E88DC'];
    }
  };

  const MacroCard = ({ label, value, goal, unit, colors }: any) => (
    <View style={styles.macroCard}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.macroGradient}
      >
        <View style={styles.macroContent}>
          <Text style={styles.macroLabel}>{label}</Text>
          <Text style={styles.macroValue}>
            {value.toFixed(1)}{unit}
          </Text>
          <Text style={styles.macroGoal}>
            Goal: {goal}{unit}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${getProgressPercentage(value, goal)}%`,
                  backgroundColor: 'rgba(255,255,255,0.8)',
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {((value / goal) * 100).toFixed(0)}%
          </Text>
        </View>
      </LinearGradient>
    </View>
  );

  const FoodItemCard = ({ item }: { item: FoodItem }) => (
    <View style={styles.foodItemContainer}>
      <View style={styles.foodItemHeader}>
        <Text style={styles.foodItemName}>{item.name}</Text>
        <Text style={styles.confidence}>{(item.confidence * 100).toFixed(0)}%</Text>
      </View>
      <View style={styles.foodItemNutrition}>
        <View style={styles.foodItemMacro}>
          <Text style={styles.foodItemLabel}>Cal</Text>
          <Text style={styles.foodItemValue}>{item.calories.toFixed(0)}</Text>
        </View>
        <View style={styles.foodItemMacro}>
          <Text style={styles.foodItemLabel}>Pro</Text>
          <Text style={styles.foodItemValue}>{item.protein.toFixed(1)}g</Text>
        </View>
        <View style={styles.foodItemMacro}>
          <Text style={styles.foodItemLabel}>Carbs</Text>
          <Text style={styles.foodItemValue}>{item.carbs.toFixed(1)}g</Text>
        </View>
        <View style={styles.foodItemMacro}>
          <Text style={styles.foodItemLabel}>Fat</Text>
          <Text style={styles.foodItemValue}>{item.fat.toFixed(1)}g</Text>
        </View>
        <View style={styles.foodItemMacro}>
          <Text style={styles.foodItemLabel}>Fiber</Text>
          <Text style={styles.foodItemValue}>{item.fiber.toFixed(1)}g</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daily Nutrition</Text>
        <Text style={styles.headerDate}>{date}</Text>
      </View>

      {/* Calorie Overview */}
      <View style={styles.calorieOverview}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.calorieGradient}
        >
          <Text style={styles.calorieLabel}>Total Calories</Text>
          <Text style={styles.calorieValue}>{calories.toFixed(0)}</Text>
          <Text style={styles.calorieGoal}>
            Goal: {goals.calories} kcal ({((calories / goals.calories) * 100).toFixed(0)}%)
          </Text>
        </LinearGradient>
      </View>

      {/* Macronutrient Cards */}
      <Text style={styles.sectionTitle}>Macronutrients</Text>
      <View style={styles.macroGrid}>
        <MacroCard
          label="Protein"
          value={protein}
          goal={goals.protein}
          unit="g"
          colors={getMacroColor('protein')}
        />
        <MacroCard
          label="Carbs"
          value={carbs}
          goal={goals.carbs}
          unit="g"
          colors={getMacroColor('carbs')}
        />
      </View>

      <View style={styles.macroGrid}>
        <MacroCard
          label="Fat"
          value={fat}
          goal={goals.fat}
          unit="g"
          colors={getMacroColor('fat')}
        />
        <MacroCard
          label="Fiber"
          value={fiber}
          goal={goals.fiber}
          unit="g"
          colors={getMacroColor('fiber')}
        />
      </View>

      {/* Food Items List */}
      {items.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Food Items ({items.length})</Text>
          <View style={styles.foodItemsList}>
            {items.map((item) => (
              <FoodItemCard key={item.id} item={item} />
            ))}
          </View>
        </>
      )}

      {items.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No food items logged yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Scan food images to add them and track your nutrition
          </Text>
        </View>
      )}

      {/* Auto-delete Info */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>📅 Automatic Data Management</Text>
        <Text style={styles.infoText}>
          Nutrition data is automatically organized by date and retained for 7 days. Data older than 7 days is automatically deleted to free up storage space.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  headerDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  calorieOverview: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  calorieGradient: {
    padding: 20,
    alignItems: 'center',
  },
  calorieLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  calorieValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  calorieGoal: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 20,
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  macroCard: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  macroGradient: {
    padding: 16,
  },
  macroContent: {
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 6,
    fontWeight: '500',
  },
  macroValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  macroGoal: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    fontWeight: '600',
  },
  foodItemsList: {
    gap: 12,
    marginBottom: 20,
  },
  foodItemContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  foodItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  foodItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textTransform: 'capitalize',
  },
  confidence: {
    fontSize: 12,
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontWeight: '500',
  },
  foodItemNutrition: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  foodItemMacro: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  foodItemLabel: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500',
    marginBottom: 4,
  },
  foodItemValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: '#999',
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#0d47a1',
    lineHeight: 18,
  },
});

export default NutritionDisplay;
