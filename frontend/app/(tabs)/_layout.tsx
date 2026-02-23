import { Tabs } from 'expo-router';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#E5E7EB',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopColor: '#E5E7EB',
          borderTopWidth: 2,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingBottom: 20,
          paddingTop: 12,
          height: 95,
          shadowColor: '#E5E7EB',
          shadowOpacity: 0.3,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -4 },
          elevation: 15,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons 
              name="dashboard" 
              size={focused ? 28 : 24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'Scanner',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons 
              name="photo-camera" 
              size={focused ? 28 : 24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Workout',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons 
              name="fitness-center" 
              size={focused ? 28 : 24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons 
              name="person" 
              size={focused ? 28 : 24} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
