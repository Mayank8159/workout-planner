import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

export default function SplashScreen() {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const loaderWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b', '#0f172a']}
      className="flex-1"
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Center Content */}
      <View className="flex-1 items-center justify-center px-6">
        {/* Logo Circle */}
        <View className="mb-8 items-center">
          <LinearGradient
            colors={['#10b981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 140,
              height: 140,
              borderRadius: 70,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 32,
              shadowColor: '#10b981',
              shadowOpacity: 0.5,
              shadowRadius: 15,
              elevation: 10,
            }}
          >
            <MaterialIcons name="sports-bar" size={80} color="#ffffff" />
          </LinearGradient>
        </View>

        {/* Main Text */}
        <Text className="text-white text-3xl font-bold text-center mb-2">
          WorkoutPlanner
        </Text>

        {/* Subtext */}
        <Text className="text-slate-400 text-base text-center mb-12">
          Your AI-powered fitness companion
        </Text>

        {/* Animated Dots */}
        <View className="flex-row gap-1 mb-16">
          <View className="w-2 h-2 rounded-full bg-emerald-500" />
          <View className="w-2 h-2 rounded-full bg-emerald-500 opacity-50" />
          <View className="w-2 h-2 rounded-full bg-emerald-500 opacity-25" />
        </View>
      </View>

      {/* Bottom Line Loader */}
      <View className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
        <Animated.View
          style={{
            width: loaderWidth,
            height: '100%',
            backgroundColor: '#10b981',
            shadowColor: '#10b981',
            shadowOpacity: 0.6,
            shadowRadius: 10,
            elevation: 5,
          }}
        />
      </View>
    </LinearGradient>
  );
}
