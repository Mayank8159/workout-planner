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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      className="flex-1"
    >
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#0f172a']}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, paddingTop: 20 }}
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          scrollEnabled={true}
        >
          <View className="flex-1 justify-center px-6 py-12" style={{ paddingBottom: 100 }}>
            {/* Logo/Header */}
            <View className="items-center mb-10">
              <LinearGradient
                colors={['rgba(34, 197, 94, 0.25)', 'rgba(34, 197, 94, 0.1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 24,
                  padding: 18,
                  marginBottom: 20,
                  borderWidth: 1,
                  borderColor: 'rgba(34, 197, 94, 0.3)',
                }}>
                <MaterialIcons name="person-add" size={56} color="#22c55e" />
              </LinearGradient>
              <Text className="text-white text-4xl font-900 mb-3">Create Account</Text>
              <Text className="text-slate-300 text-base text-center">Start your fitness transformation today</Text>
            </View>

            {/* Error Message */}
            {error ? (
              <LinearGradient
                colors={['rgba(239, 68, 68, 0.15)', 'rgba(239, 68, 68, 0.05)']}
                style={{
                  borderRadius: 14,
                  padding: 14,
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                }}>
                <View className="flex-row items-center">
                  <MaterialIcons name="error" size={18} color="#fca5a5" style={{ marginRight: 10 }} />
                  <Text className="text-red-300 text-sm flex-1">{error}</Text>
                </View>
              </LinearGradient>
            ) : null}

            {/* Username Input */}
            <View className="mb-4">
              <View className="flex-row items-center mb-3">
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 10,
                    borderWidth: 1,
                    borderColor: 'rgba(34, 197, 94, 0.3)',
                  }}>
                  <MaterialIcons name="person" size={16} color="#22c55e" />
                </View>
                <Text className="text-slate-300 text-sm font-semibold">Username</Text>
              </View>
              <LinearGradient
                colors={['rgba(30, 41, 59, 0.4)', 'rgba(15, 23, 42, 0.6)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 14,
                  paddingHorizontal: 4,
                  borderWidth: 1.5,
                  borderColor: 'rgba(34, 197, 94, 0.25)',
                }}>
                <View className="flex-row items-center px-4 py-4">
                  <TextInput
                    className="flex-1 text-white text-base"
                    style={{ color: '#ffffff' }}
                    placeholder="Choose a username"
                    placeholderTextColor="#64748b"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                </View>
              </LinearGradient>
            </View>

            {/* Email Input */}
            <View className="mb-4">
              <View className="flex-row items-center mb-3">
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: 'rgba(59, 130, 246, 0.15)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 10,
                    borderWidth: 1,
                    borderColor: 'rgba(59, 130, 246, 0.3)',
                  }}>
                  <MaterialIcons name="email" size={16} color="#3b82f6" />
                </View>
                <Text className="text-slate-300 text-sm font-semibold">Email Address</Text>
              </View>
              <LinearGradient
                colors={['rgba(30, 41, 59, 0.4)', 'rgba(15, 23, 42, 0.6)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 14,
                  paddingHorizontal: 4,
                  borderWidth: 1.5,
                  borderColor: 'rgba(59, 130, 246, 0.25)',
                }}>
                <View className="flex-row items-center px-4 py-4">
                  <TextInput
                    className="flex-1 text-white text-base"
                    style={{ color: '#ffffff' }}
                    placeholder="your.email@example.com"
                    placeholderTextColor="#64748b"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
              </LinearGradient>
            </View>

            {/* Password Input */}
            <View className="mb-4">
              <View className="flex-row items-center mb-3">
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: 'rgba(168, 85, 247, 0.15)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 10,
                    borderWidth: 1,
                    borderColor: 'rgba(168, 85, 247, 0.3)',
                  }}>
                  <MaterialIcons name="lock" size={16} color="#a855f7" />
                </View>
                <Text className="text-slate-300 text-sm font-semibold">Password</Text>
              </View>
              <LinearGradient
                colors={['rgba(30, 41, 59, 0.4)', 'rgba(15, 23, 42, 0.6)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 14,
                  paddingHorizontal: 4,
                  borderWidth: 1.5,
                  borderColor: 'rgba(168, 85, 247, 0.25)',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TextInput
                  className="flex-1 text-white text-base px-4 py-4"
                  style={{ color: '#ffffff' }}
                  placeholder="Minimum 6 characters"
                  placeholderTextColor="#64748b"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="pr-4">
                  <MaterialIcons 
                    name={showPassword ? "visibility" : "visibility-off"} 
                    size={20} 
                    color="#a855f7" 
                  />
                </TouchableOpacity>
              </LinearGradient>
            </View>

            {/* Confirm Password Input */}
            <View className="mb-8">
              <View className="flex-row items-center mb-3">
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: 'rgba(168, 85, 247, 0.15)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 10,
                    borderWidth: 1,
                    borderColor: 'rgba(168, 85, 247, 0.3)',
                  }}>
                  <MaterialIcons name="lock" size={16} color="#a855f7" />
                </View>
                <Text className="text-slate-300 text-sm font-semibold">Confirm Password</Text>
              </View>
              <LinearGradient
                colors={['rgba(30, 41, 59, 0.4)', 'rgba(15, 23, 42, 0.6)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 14,
                  paddingHorizontal: 4,
                  borderWidth: 1.5,
                  borderColor: 'rgba(168, 85, 247, 0.25)',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TextInput
                  className="flex-1 text-white text-base px-4 py-4"
                  style={{ color: '#ffffff' }}
                  placeholder="Re-enter your password"
                  placeholderTextColor="#64748b"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} className="pr-4">
                  <MaterialIcons 
                    name={showConfirmPassword ? "visibility" : "visibility-off"} 
                    size={20} 
                    color="#a855f7" 
                  />
                </TouchableOpacity>
              </LinearGradient>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={handleSignUp}
              disabled={loading}
              className="mb-8"
            >
              <LinearGradient
                colors={['rgba(34, 197, 94, 0.3)', 'rgba(34, 197, 94, 0.15)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 14,
                  paddingVertical: 16,
                  alignItems: 'center',
                  borderWidth: 1.5,
                  borderColor: 'rgba(34, 197, 94, 0.4)',
                  shadowColor: '#22c55e',
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  elevation: 8,
                }}>
                {loading ? (
                  <ActivityIndicator color="#22c55e" />
                ) : (
                  <View className="flex-row items-center justify-center">
                    <MaterialIcons name="person-add" size={20} color="#22c55e" />
                    <Text className="text-green-300 text-base font-bold ml-2">Create Account</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Login Link */}
            <View className="flex-row justify-center items-center">
              <Text className="text-slate-400">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.replace('/login')}>
                <Text className="text-green-300 font-semibold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
