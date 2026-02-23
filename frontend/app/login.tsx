import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '@/context/UserContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useUser();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      router.replace('/(tabs)/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Better error handling
      if (err.code === 'ERR_NETWORK') {
        setError('Network error. Please check your connection and ensure the backend is running.');
      } else if (err.response) {
        if (err.response.status === 401) {
          setError('Invalid email or password. Please try again or sign up for a new account.');
        } else {
          setError(err.response?.data?.detail || err.response?.data?.message || 'Login failed. Please try again.');
        }
      } else {
        setError('Unable to connect to server. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#0f172a']}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          className="flex-1"
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-6 py-12">
            {/* Logo/Header */}
            <View className="items-center mb-12">
              <View className="bg-emerald-500 rounded-full p-4 mb-4">
                <MaterialIcons name="fitness-center" size={48} color="#0f172a" />
              </View>
              <Text className="text-white text-4xl font-bold mb-2">Welcome Back</Text>
              <Text className="text-slate-400 text-base">Sign in to continue your fitness journey</Text>
            </View>

            {/* Error Message */}
            {error ? (
              <View className="bg-red-500/10 border border-red-500 rounded-2xl p-4 mb-4">
                <Text className="text-red-500 text-center">{error}</Text>
              </View>
            ) : null}

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-slate-300 text-sm mb-2 ml-1">Email Address</Text>
              <View className="bg-slate-800 rounded-2xl flex-row items-center px-4 py-4 border border-slate-700">
                <MaterialIcons name="email" size={20} color="#64748b" />
                <TextInput
                  className="flex-1 ml-3 text-white text-base"
                  placeholder="your.email@example.com"
                  placeholderTextColor="#64748b"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-slate-300 text-sm mb-2 ml-1">Password</Text>
              <View className="bg-slate-800 rounded-2xl flex-row items-center px-4 py-4 border border-slate-700">
                <MaterialIcons name="lock" size={20} color="#64748b" />
                <TextInput
                  className="flex-1 ml-3 text-white text-base"
                  placeholder="Enter your password"
                  placeholderTextColor="#64748b"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons 
                    name={showPassword ? "visibility" : "visibility-off"} 
                    size={20} 
                    color="#64748b" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity className="items-end mb-6">
              <Text className="text-emerald-500 text-sm">Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className="mb-6"
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                className="rounded-2xl py-4 items-center"
                style={{ shadowColor: '#10b981', shadowOpacity: 0.4, shadowRadius: 10, elevation: 5 }}
              >
                {loading ? (
                  <ActivityIndicator color="#0f172a" />
                ) : (
                  <Text className="text-slate-900 text-base font-bold">Sign In</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View className="flex-row justify-center">
              <Text className="text-slate-400">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/signup')}>
                <Text className="text-emerald-500 font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
