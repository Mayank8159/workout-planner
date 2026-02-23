import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen() {
  return (
    <LinearGradient colors={['#0a0e27', '#1a1f3a']} className="flex-1" start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      {/* Animated Background Glow */}
      <View className="absolute inset-0" style={{ 
        backgroundColor: 'rgba(168, 85, 247, 0.05)',
      }} />

      {/* Center Content */}
      <View className="flex-1 items-center justify-center px-6">
        {/* Glass Card Container */}
        <View 
          className="items-center gap-6 p-8 rounded-2xl"
          style={{
            backgroundColor: 'rgba(26, 31, 58, 0.5)',
            borderWidth: 1,
            borderColor: 'rgba(168, 85, 247, 0.3)',
            shadowColor: '#a855f7',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          {/* Spinner with Glow */}
          <View 
            style={{
              shadowColor: '#a855f7',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 15,
              elevation: 8,
            }}
          >
            <ActivityIndicator size="large" color="#a855f7" />
          </View>

          {/* Main Message */}
          <Text className="text-white text-xl font-bold text-center" style={{ 
            textShadowColor: 'rgba(168, 85, 247, 0.5)',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 10,
          }}>
            Waking up the AI engine...
          </Text>

          {/* Subtext */}
          <Text className="text-neon-cyan text-sm text-center opacity-80">
            Initializing your workout companion
          </Text>

          {/* Bottom Accent Line */}
          <View className="h-0.5 w-12 rounded-full" style={{
            backgroundColor: '#a855f7',
            shadowColor: '#a855f7',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 8,
          }} />
        </View>
      </View>

      {/* Bottom Corner Accent */}
      <View className="absolute bottom-10 right-10 w-20 h-20 rounded-full opacity-30" style={{
        backgroundColor: '#0ea5e9',
        shadowColor: '#0ea5e9',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
      }} />
    </LinearGradient>
  );
}
