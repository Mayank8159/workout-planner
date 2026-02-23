import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  StatusBar as RNStatusBar,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useUser } from '@/context/UserContext';
import { dataAPI } from '@/utils/api';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, refreshUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    dailyCalorieGoal: '2000',
    proteinGoal: '150',
    carbsGoal: '200',
    fiberGoal: '25',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        dailyCalorieGoal: user.dailyCalorieGoal?.toString() || '2000',
        proteinGoal: user.proteinGoal?.toString() || '150',
        carbsGoal: user.carbsGoal?.toString() || '200',
        fiberGoal: user.fiberGoal?.toString() || '25',
      });
      setIsLoading(false);
    }
  }, [user]);

  const saveSettings = async () => {
    if (!formData.username.trim()) return setError('Please enter your name');
    try {
      setIsSaving(true);
      setError(null);
      await dataAPI.updateUserSettings({
        username: formData.username,
        dailyCalorieGoal: parseInt(formData.dailyCalorieGoal),
        proteinGoal: parseInt(formData.proteinGoal),
        carbsGoal: parseInt(formData.carbsGoal),
        fiberGoal: parseInt(formData.fiberGoal),
      });
      if (refreshUser) await refreshUser();
      setSuccessMessage('Settings updated successfully! ✓');
      setTimeout(() => router.back(), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Redundant but safe: hides header within the component too */}
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />
      
      <LinearGradient colors={['#0f172a', '#1e293b']} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          
          {/* Professional Header */}
          <LinearGradient colors={['rgba(59, 130, 246, 0.1)', 'rgba(15, 23, 42, 0)']} style={styles.headerGradient}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <MaterialIcons name="arrow-back" size={24} color="#60a5fa" />
              </TouchableOpacity>
              <View style={styles.headerTitleContainer}>
                <LinearGradient colors={['rgba(59, 130, 246, 0.2)', 'rgba(59, 130, 246, 0.1)']} style={{ borderRadius: 12, padding: 8, marginRight: 10 }}>
                  <MaterialIcons name="settings" size={24} color="#3b82f6" />
                </LinearGradient>
                <View>
                  <Text style={styles.headerText}>Settings</Text>
                  <Text style={{ fontSize: 11, color: '#cbd5e1', fontWeight: '500' }}>Customize your experience</Text>
                </View>
              </View>
              <View style={{ width: 44 }} /> 
            </View>
          </LinearGradient>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {error && (
              <LinearGradient colors={['rgba(239, 68, 68, 0.12)', 'rgba(239, 68, 68, 0.05)']} style={styles.errorBox}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialIcons name="error-outline" size={18} color="#f87171" style={{ marginRight: 10 }} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              </LinearGradient>
            )}
            {successMessage && (
              <LinearGradient colors={['rgba(34, 197, 94, 0.12)', 'rgba(34, 197, 94, 0.05)']} style={styles.successBox}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialIcons name="check-circle" size={18} color="#22c55e" style={{ marginRight: 10 }} />
                  <Text style={styles.successText}>{successMessage}</Text>
                </View>
              </LinearGradient>
            )}

            {/* Profile Section */}
            <View style={{ marginBottom: 32 }}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <MaterialIcons name="person" size={18} color="#60a5fa" />
                </View>
                <Text style={styles.sectionLabel}>Profile Information</Text>
              </View>
              <LinearGradient colors={['rgba(59, 130, 246, 0.12)', 'rgba(59, 130, 246, 0.06)']} style={styles.card}>
                <Text style={styles.inputLabel}>Display Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.username}
                  onChangeText={(v) => setFormData({...formData, username: v})}
                  placeholder="Enter your name"
                  placeholderTextColor="#475569"
                  selectionColor="#60a5fa"
                />
              </LinearGradient>
            </View>

            {/* Daily Goals Section */}
            <View>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <MaterialIcons name="flag" size={18} color="#f87171" />
                </View>
                <Text style={styles.sectionLabel}>Daily Nutrition Goals</Text>
              </View>
              <View style={styles.grid}>
              <GoalInput label="Calories" value={formData.dailyCalorieGoal} onChange={(v:any) => setFormData({...formData, dailyCalorieGoal: v})} color="#f87171" unit="kcal" icon="local-fire-department" />
              <GoalInput label="Protein" value={formData.proteinGoal} onChange={(v:any) => setFormData({...formData, proteinGoal: v})} color="#4ade80" unit="g" icon="fitness-center" />
              <GoalInput label="Carbs" value={formData.carbsGoal} onChange={(v:any) => setFormData({...formData, carbsGoal: v})} color="#fb923c" unit="g" icon="grain" />
              <GoalInput label="Fiber" value={formData.fiberGoal} onChange={(v:any) => setFormData({...formData, fiberGoal: v})} color="#60a5fa" unit="g" icon="eco" />
              </View>
            </View>

            <TouchableOpacity onPress={saveSettings} disabled={isSaving} style={styles.saveButton}>
              <LinearGradient colors={['#3b82f6', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientButton}>
                {isSaving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <MaterialIcons name="save" size={18} color="#fff" />
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function GoalInput({ label, value, onChange, color, unit, icon }: any) {
  return (
    <LinearGradient colors={[`rgba(${color === '#f87171' ? '248, 113, 113' : color === '#4ade80' ? '74, 222, 128' : color === '#fb923c' ? '251, 146, 60' : '96, 165, 250'}, 0.12)`, `rgba(${color === '#f87171' ? '248, 113, 113' : color === '#4ade80' ? '74, 222, 128' : color === '#fb923c' ? '251, 146, 60' : '96, 165, 250'}, 0.06)`]} style={styles.goalCard}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: `${color}20`, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, alignSelf: 'flex-start' }}>
        <MaterialIcons name={icon} size={14} color={color} />
        <Text style={{ color: color, fontSize: 10, fontWeight: '700', marginLeft: 4 }}>{label.toUpperCase()}</Text>
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
        selectionColor={color}
        placeholder="0"
        placeholderTextColor="#475569"
      />
      <Text style={{ color: '#94a3b8', fontSize: 10, marginTop: 8, textAlign: 'right', fontWeight: '500' }}>{unit}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerGradient: {
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.15)',
  },
  backButton: { padding: 10, borderRadius: 12, backgroundColor: 'rgba(59, 130, 246, 0.15)', borderWidth: 1.5, borderColor: 'rgba(59, 130, 246, 0.3)' },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center', flex: 1, marginLeft: 8 },
  headerText: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 2 },
  scrollContent: { padding: 20, paddingBottom: 40, paddingTop: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionIconContainer: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(59, 130, 246, 0.15)', justifyContent: 'center', alignItems: 'center', marginRight: 12, borderWidth: 1.5, borderColor: 'rgba(59, 130, 246, 0.25)' },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: '#e2e8f0', letterSpacing: 0.5 },
  card: { borderRadius: 18, padding: 20, borderWidth: 1.5, borderColor: 'rgba(59, 130, 246, 0.2)', overflow: 'hidden' },
  inputLabel: { fontSize: 11, fontWeight: '700', color: '#cbd5e1', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: 14, padding: 14, color: '#fff', fontWeight: '600', borderWidth: 1.5, borderColor: 'rgba(59, 130, 246, 0.25)', fontSize: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 24 },
  goalCard: { width: '48%', borderRadius: 18, padding: 16, borderWidth: 1.5, borderColor: 'rgba(59, 130, 246, 0.2)' },
  saveButton: { marginTop: 12, marginBottom: 12, borderRadius: 16, overflow: 'hidden', shadowColor: '#3b82f6', shadowOpacity: 0.3, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 12 },
  gradientButton: { paddingVertical: 18, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '800', marginLeft: 10 },
  errorBox: { padding: 14, borderRadius: 14, marginBottom: 20, marginTop: 12, borderLeftWidth: 4, borderLeftColor: '#f87171', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' },
  errorText: { color: '#fca5a5', fontWeight: '600', fontSize: 13, flex: 1 },
  successBox: { padding: 14, borderRadius: 14, marginBottom: 20, marginTop: 12, borderLeftWidth: 4, borderLeftColor: '#22c55e', borderWidth: 1, borderColor: 'rgba(34, 197, 94, 0.3)' },
  successText: { color: '#86efac', fontWeight: '600', fontSize: 13, flex: 1 },
});