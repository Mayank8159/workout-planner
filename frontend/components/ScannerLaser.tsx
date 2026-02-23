import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const ScannerLaser = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, []);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300], // Adjust based on frame height
  });

  return (
    <Animated.View
      style={[
        styles.laserLine,
        {
          transform: [{ translateY }],
        },
      ]}
    >
      <LinearGradient
        colors={['transparent', '#10b981', '#10b981', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  laserLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    zIndex: 10,
  },
  gradient: {
    flex: 1,
    shadowColor: '#10b981',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
});
