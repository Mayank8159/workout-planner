import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

export default function SplashScreen() {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

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

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const loaderWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const scale = pulseAnim;

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b', '#0f172a']}
      className="flex-1"
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Center Content */}
      <View className="flex-1 items-center justify-center px-6">
        {/* Animated Silver Logo Circle */}
        <Animated.View
          style={{
            marginBottom: 32,
            transform: [{ scale }],
          }}
        >
          <View
            style={{
              width: 140,
              height: 140,
              borderRadius: 70,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#E5E7EB',
              shadowColor: '#E5E7EB',
              shadowOpacity: 0.6,
              shadowRadius: 20,
              elevation: 12,
            }}
          >
            <MaterialIcons name="fitness-center" size={70} color="#6B21A8" />
          </View>
        </Animated.View>

        {/* Main Text */}
        <Text className="text-white text-3xl font-bold text-center mb-2">
          WorkoutPlanner
        </Text>

        {/* Subtext */}
        <Text className="text-gray-400 text-base text-center mb-12">
          Your AI-powered fitness companion
        </Text>

        {/* Animated Pulsing Dots */}
        <View className="flex-row gap-3 mb-16">
          <View className="w-3 h-3 rounded-full bg-gray-300" />
          <View className="w-3 h-3 rounded-full bg-gray-300 opacity-60" />
          <View className="w-3 h-3 rounded-full bg-gray-300 opacity-30" />
        </View>
      </View>

      {/* Bottom Line Loader */}
      <View className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
        <Animated.View
          style={{
            width: loaderWidth,
            height: '100%',
            backgroundColor: '#E5E7EB',
            shadowColor: '#E5E7EB',
            shadowOpacity: 0.7,
            shadowRadius: 10,
            elevation: 5,
          }}
        />
      </View>
    </LinearGradient>
  );
}
