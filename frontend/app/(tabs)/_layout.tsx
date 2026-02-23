import { Tabs } from 'expo-router';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopColor: 'transparent',
          borderTopWidth: 0,
          paddingBottom: 16,
          paddingTop: 12,
          height: 90,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['rgba(30, 41, 59, 0.85)', 'rgba(15, 23, 42, 0.92)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 90,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              borderTopWidth: 1,
              borderTopColor: 'rgba(133, 150, 166, 0.35)',
              shadowColor: '#000000',
              shadowOpacity: 0.4,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: -8 },
              elevation: 25,
              overflow: 'hidden',
            }}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                backgroundColor: focused ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                borderRadius: 12,
                padding: 8,
                marginBottom: 4,
              }}
            >
              <MaterialIcons 
                name="dashboard" 
                size={focused ? 28 : 24} 
                color={focused ? '#3b82f6' : '#94a3b8'} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'Scanner',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                backgroundColor: focused ? 'rgba(249, 115, 22, 0.2)' : 'transparent',
                borderRadius: 12,
                padding: 8,
                marginBottom: 4,
              }}
            >
              <MaterialIcons 
                name="photo-camera" 
                size={focused ? 28 : 24} 
                color={focused ? '#f97316' : '#94a3b8'} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Workout',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                backgroundColor: focused ? 'rgba(167, 139, 250, 0.2)' : 'transparent',
                borderRadius: 12,
                padding: 8,
                marginBottom: 4,
              }}
            >
              <MaterialIcons 
                name="fitness-center" 
                size={focused ? 28 : 24} 
                color={focused ? '#a78bfa' : '#94a3b8'} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                backgroundColor: focused ? 'rgba(236, 72, 153, 0.2)' : 'transparent',
                borderRadius: 12,
                padding: 8,
                marginBottom: 4,
              }}
            >
              <MaterialIcons 
                name="person" 
                size={focused ? 28 : 24} 
                color={focused ? '#ec4899' : '#94a3b8'} 
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
