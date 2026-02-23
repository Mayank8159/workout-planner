import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function ProfileScreen() {
  const { user, logout } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              // Clear stored tokens and user data
              await SecureStore.deleteItemAsync('accessToken');
              await SecureStore.deleteItemAsync('refreshToken');
              
              // Call logout from context
              logout();
              
              // Navigate to login
              router.replace('/login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <ScrollView style={{ flex: 1, backgroundColor: '#0f172a' }} contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 28, fontWeight: '700', color: '#ffffff', marginBottom: 8 }}>
            Profile
          </Text>
          <Text style={{ fontSize: 14, color: '#94a3b8' }}>
            Manage your account
          </Text>
        </View>

        {/* User Info Card */}
        <LinearGradient
          colors={['rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: 'rgba(16, 185, 129, 0.3)',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}>
              <MaterialIcons name="person" size={32} color="#10b981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#ffffff' }}>
                {user?.username || 'User'}
              </Text>
              <Text style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
                {user?.email || 'user@example.com'}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* User Stats */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#e2e8f0', marginBottom: 12 }}>
            Account Info
          </Text>
          <View style={{
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: 'rgba(51, 65, 85, 0.5)',
            marginBottom: 12,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 14, color: '#94a3b8' }}>User ID</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#e2e8f0' }}>
                {user?.id || 'N/A'}
              </Text>
            </View>
          </View>
          <View style={{
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: 'rgba(51, 65, 85, 0.5)',
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: '#94a3b8' }}>Member Since</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#e2e8f0' }}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#e2e8f0', marginBottom: 12 }}>
            Quick Links
          </Text>
          
          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              borderRadius: 12,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderWidth: 1,
              borderColor: 'rgba(51, 65, 85, 0.5)',
              marginBottom: 12,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="settings" size={20} color="#10b981" />
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#e2e8f0', marginLeft: 12 }}>
                Settings
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#64748b" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              borderRadius: 12,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderWidth: 1,
              borderColor: 'rgba(51, 65, 85, 0.5)',
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="help" size={20} color="#10b981" />
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#e2e8f0', marginLeft: 12 }}>
                Help & Support
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 1.5,
            borderColor: '#ef4444',
            borderRadius: 12,
            paddingVertical: 16,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 12,
          }}>
          <MaterialIcons name="logout" size={20} color="#ef4444" />
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#ef4444', marginLeft: 8 }}>
            Logout
          </Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
