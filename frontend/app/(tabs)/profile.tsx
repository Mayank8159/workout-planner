import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '@/context/UserContext';
import LogoutConfirmModal from '@/components/LogoutConfirmModal';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useUser();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutPress = () => {
    console.log('🔴 LOGOUT BUTTON PRESSED - Opening confirmation modal');
    setLogoutModalVisible(true);
  };

  const handleConfirmLogout = () => {
    console.log('🚪 User confirmed logout, executing logout()...');
    setIsLoggingOut(true);
    
    logout()
      .then(() => {
        console.log('✓ Logout complete - root layout will redirect to login');
        setLogoutModalVisible(false);
        setIsLoggingOut(false);
      })
      .catch((error) => {
        console.error('❌ Logout error:', error);
        setIsLoggingOut(false);
        setLogoutModalVisible(false);
      });
  };

  const handleCancelLogout = () => {
    console.log('⏸️ User cancelled logout');
    setLogoutModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <ScrollView style={{ flex: 1, backgroundColor: '#0f172a' }} contentContainerStyle={{ padding: 20, paddingBottom: 140 }}>
        {/* Header */}
        <LinearGradient
          colors={['rgba(236, 72, 153, 0.15)', 'rgba(236, 72, 153, 0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 20,
            padding: 20,
            marginBottom: 30,
            borderWidth: 1,
            borderColor: 'rgba(236, 72, 153, 0.3)',
          }}>
          <Text style={{ fontSize: 32, fontWeight: '800', color: '#ffffff', marginBottom: 6 }}>
            Profile
          </Text>
          <Text style={{ fontSize: 14, color: '#cbd5e1' }}>
            Manage your account and settings
          </Text>
        </LinearGradient>

        {/* User Info Card */}
        <LinearGradient
          colors={['rgba(236, 72, 153, 0.12)', 'rgba(236, 72, 153, 0.06)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 20,
            padding: 24,
            marginBottom: 28,
            borderWidth: 1,
            borderColor: 'rgba(236, 72, 153, 0.35)',
            shadowColor: '#000000',
            shadowOpacity: 0.2,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 8,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <LinearGradient
              colors={['rgba(236, 72, 153, 0.25)', 'rgba(236, 72, 153, 0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
                borderWidth: 2,
                borderColor: 'rgba(236, 72, 153, 0.3)',
              }}>
              <MaterialIcons name="person" size={32} color="#ec4899" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#ffffff' }}>
                {user?.username || 'User'}
              </Text>
              <Text style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>
                {user?.email || 'user@example.com'}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* User Stats */}
        <View style={{ marginBottom: 28 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#e2e8f0', marginBottom: 14 }}>
            Account Information
          </Text>
          <LinearGradient
            colors={['rgba(30, 41, 59, 0.5)', 'rgba(15, 23, 42, 0.7)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 16,
              padding: 18,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: 'rgba(71, 85, 105, 0.4)',
            }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: '#94a3b8', fontWeight: '500' }}>User ID</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#cbd5e1' }}>
                {user?.id || 'N/A'}
              </Text>
            </View>
          </LinearGradient>
          <LinearGradient
            colors={['rgba(30, 41, 59, 0.5)', 'rgba(15, 23, 42, 0.7)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 16,
              padding: 18,
              borderWidth: 1,
              borderColor: 'rgba(71, 85, 105, 0.4)',
            }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: '#94a3b8', fontWeight: '500' }}>Member Since</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#cbd5e1' }}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={{ marginBottom: 28 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#e2e8f0', marginBottom: 14 }}>
            Quick Actions
          </Text>
          
          <TouchableOpacity
            style={{
              marginBottom: 12,
            }}>
            <LinearGradient
              colors={['rgba(59, 130, 246, 0.12)', 'rgba(59, 130, 246, 0.06)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 16,
                padding: 18,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderWidth: 1,
                borderColor: 'rgba(59, 130, 246, 0.3)',
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}>
                  <MaterialIcons name="settings" size={22} color="#3b82f6" />
                </View>
                <Text style={{ fontSize: 15, fontWeight: '600', color: '#e2e8f0' }}>
                  Settings
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color="#64748b" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/help-support')}
            style={{
              marginBottom: 12,
            }}>
            <LinearGradient
              colors={['rgba(168, 85, 247, 0.12)', 'rgba(168, 85, 247, 0.06)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 16,
                padding: 18,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderWidth: 1,
                borderColor: 'rgba(168, 85, 247, 0.3)',
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  backgroundColor: 'rgba(168, 85, 247, 0.15)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}>
                  <MaterialIcons name="help" size={22} color="#a855f7" />
                </View>
                <Text style={{ fontSize: 15, fontWeight: '600', color: '#e2e8f0' }}>
                  Help & Support
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color="#64748b" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogoutPress}
          style={{
            marginTop: 8,
          }}>
          <LinearGradient
            colors={['rgba(239, 68, 68, 0.15)', 'rgba(239, 68, 68, 0.08)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 16,
              paddingVertical: 18,
              paddingHorizontal: 18,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1.5,
              borderColor: 'rgba(239, 68, 68, 0.4)',
            }}>
            <MaterialIcons name="logout" size={22} color="#ef4444" />
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#ef4444', marginLeft: 10 }}>
              Logout
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        visible={logoutModalVisible}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        isLoading={isLoggingOut}
      />
    </SafeAreaView>
  );
}