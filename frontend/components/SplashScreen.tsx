import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';

export default function SplashScreen() {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Loading bar animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Pulsing scale animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1800,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Text fade animation
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const loaderWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const scale = pulseAnim;
  const textOpacity = fadeAnim;

  return (
    <LinearGradient
      colors={['rgba(15, 23, 42, 1)', 'rgba(30, 41, 59, 0.95)', 'rgba(15, 23, 42, 1)']}
      className="flex-1"
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Animated Gradient Accents */}
      <LinearGradient
        colors={['rgba(168, 85, 247, 0.1)', 'rgba(59, 130, 246, 0.05)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.6 }}
      />

      {/* Center Content */}
      <View className="flex-1 items-center justify-center px-6">
        {/* Animated Logo Container with Gradient */}
        <Animated.View
          style={{
            marginBottom: 40,
            transform: [{ scale }],
          }}
        >
          <LinearGradient
            colors={['rgba(168, 85, 247, 0.3)', 'rgba(139, 92, 246, 0.15)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 160,
              height: 160,
              borderRadius: 80,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: 'rgba(168, 85, 247, 0.4)',
              shadowColor: '#a855f7',
              shadowOpacity: 0.4,
              shadowRadius: 25,
              elevation: 15,
            }}
          >
            <BlurView intensity={80} style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 80 }}>
              <MaterialIcons name="fitness-center" size={80} color="#e9d5ff" />
            </BlurView>
          </LinearGradient>
        </Animated.View>

        {/* Main Text with Animation */}
        <Animated.View style={{ opacity: textOpacity }}>
          <Text className="text-white text-5xl font-black text-center mb-3">
            WorkoutPlanner
          </Text>
        </Animated.View>

        {/* Subtext with Gradient */}
        <LinearGradient
          colors={['rgba(168, 85, 247, 0.15)', 'rgba(59, 130, 246, 0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 12,
            paddingHorizontal: 20,
            paddingVertical: 10,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: 'rgba(168, 85, 247, 0.2)',
          }}
        >
          <Text className="text-purple-200 text-center text-base font-semibold">
            Your AI-powered fitness companion
          </Text>
        </LinearGradient>

        {/* Loading Status Text */}
        <Text className="text-slate-400 text-sm text-center mb-20">
          Preparing your workout experience...
        </Text>

        {/* Animated Pulsing Dots - Color Coded */}
        <View className="flex-row gap-2 mb-12">
          <Animated.View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: '#3b82f6',
              opacity: Animated.sequence([
                Animated.delay(0),
                Animated.loop(
                  Animated.sequence([
                    Animated.timing(new Animated.Value(1), {
                      toValue: 0.3,
                      duration: 600,
                      useNativeDriver: false,
                    }),
                    Animated.timing(new Animated.Value(0.3), {
                      toValue: 1,
                      duration: 600,
                      useNativeDriver: false,
                    }),
                  ])
                ),
              ]),
            }}
          />
          <Animated.View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: '#a78bfa',
              opacity: Animated.sequence([
                Animated.delay(200),
                Animated.loop(
                  Animated.sequence([
                    Animated.timing(new Animated.Value(1), {
                      toValue: 0.3,
                      duration: 600,
                      useNativeDriver: false,
                    }),
                    Animated.timing(new Animated.Value(0.3), {
                      toValue: 1,
                      duration: 600,
                      useNativeDriver: false,
                    }),
                  ])
                ),
              ]),
            }}
          />
          <Animated.View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: '#22c55e',
              opacity: Animated.sequence([
                Animated.delay(400),
                Animated.loop(
                  Animated.sequence([
                    Animated.timing(new Animated.Value(1), {
                      toValue: 0.3,
                      duration: 600,
                      useNativeDriver: false,
                    }),
                    Animated.timing(new Animated.Value(0.3), {
                      toValue: 1,
                      duration: 600,
                      useNativeDriver: false,
                    }),
                  ])
                ),
              ]),
            }}
          />
        </View>
      </View>

      {/* Top Accent Line */}
      <LinearGradient
        colors={['rgba(168, 85, 247, 0.3)', 'rgba(168, 85, 247, 0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1 }}
      />

      {/* Bottom Loading Bar with Gradient */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: 'rgba(51, 65, 85, 0.5)' }}>
        <Animated.View
          style={{
            width: loaderWidth,
            height: '100%',
            borderRadius: 2,
          }}
        >
          <LinearGradient
            colors={['rgba(168, 85, 247, 0.8)', 'rgba(59, 130, 246, 0.8)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 2,
              shadowColor: '#a855f7',
              shadowOpacity: 0.6,
              shadowRadius: 8,
              elevation: 6,
            }}
          />
        </Animated.View>
      </View>
    </LinearGradient>
  );
}
