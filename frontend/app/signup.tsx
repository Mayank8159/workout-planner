import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '@/context/UserContext';

export default function SignUpScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { register } = useUser();

  const handleSignUp = async () => {
    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Register and auto-login using UserContext
      await register(username, email, password, 2000);
      
      // Registration and auto-login successful, navigate to main app
      router.replace('/(tabs)/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      
      // Better error handling
      if (err.code === 'ERR_NETWORK') {
        setError('Network error. Please check your connection and ensure the backend is running.');
      } else if (err.response) {
        // Backend responded with error
        setError(err.response?.data?.detail || err.response?.data?.message || 'Registration failed. Please try again.');
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
            <View className="items-center mb-8">
              <View className="bg-emerald-500 rounded-full p-4 mb-4">
                <MaterialIcons name="person-add" size={48} color="#0f172a" />
              </View>
              <Text className="text-white text-4xl font-bold mb-2">Create Account</Text>
              <Text className="text-slate-400 text-base">Start your fitness transformation today</Text>
            </View>

            {/* Error Message */}
            {error ? (
              <View className="bg-red-500/10 border border-red-500 rounded-2xl p-4 mb-4">
                <Text className="text-red-500 text-center">{error}</Text>
              </View>
            ) : null}

            {/* Username Input */}
            <View className="mb-4">
              <Text className="text-slate-300 text-sm mb-2 ml-1">Username</Text>
              <View className="bg-slate-800 rounded-2xl flex-row items-center px-4 py-4 border border-slate-700">
                <MaterialIcons name="person" size={20} color="#64748b" />
                <TextInput
                  className="flex-1 ml-3 text-white text-base"
                  placeholder="Choose a username"
                  placeholderTextColor="#64748b"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </View>

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
            <View className="mb-4">
              <Text className="text-slate-300 text-sm mb-2 ml-1">Password</Text>
              <View className="bg-slate-800 rounded-2xl flex-row items-center px-4 py-4 border border-slate-700">
                <MaterialIcons name="lock" size={20} color="#64748b" />
                <TextInput
                  className="flex-1 ml-3 text-white text-base"
                  placeholder="Minimum 6 characters"
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

            {/* Confirm Password Input */}
            <View className="mb-6">
              <Text className="text-slate-300 text-sm mb-2 ml-1">Confirm Password</Text>
              <View className="bg-slate-800 rounded-2xl flex-row items-center px-4 py-4 border border-slate-700">
                <MaterialIcons name="lock" size={20} color="#64748b" />
                <TextInput
                  className="flex-1 ml-3 text-white text-base"
                  placeholder="Re-enter your password"
                  placeholderTextColor="#64748b"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <MaterialIcons 
                    name={showConfirmPassword ? "visibility" : "visibility-off"} 
                    size={20} 
                    color="#64748b" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={handleSignUp}
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
                  <Text className="text-slate-900 text-base font-bold">Create Account</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Login Link */}
            <View className="flex-row justify-center">
              <Text className="text-slate-400">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.replace('/login')}>
                <Text className="text-emerald-500 font-semibold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
