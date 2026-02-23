import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StyleSheet, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: '1',
    question: 'How do I log my workouts?',
    answer: 'Go to the Workout tab and tap the "Add Workout" button. Select the exercise type, duration, and intensity to log your session.',
  },
  {
    id: '2',
    question: 'How does food scanning work?',
    answer: 'Use the Scanner tab to take a photo of your food. Our AI model will identify the food item and provide nutrition information automatically.',
  },
  {
    id: '3',
    question: 'How is my nutrition calculated?',
    answer: 'Your daily nutrition is calculated from all logged foods and workouts. We track macronutrients (carbs, protein, fat) and calories.',
  },
  {
    id: '4',
    question: 'Can I export my data?',
    answer: 'Currently, you can view your complete history in the Dashboard tab with dates and details for each entry.',
  },
  {
    id: '5',
    question: 'Is my data secure?',
    answer: 'Yes! Your data is encrypted and stored securely. We use industry-standard authentication and secure token management.',
  },
];

const DEVELOPERS = [
  {
    name: 'Mayank Kumar Sharma',
    role: 'Full Stack Developer',
    expertise: 'Backend, Frontend, DevOps',
  },
];

export default function HelpSupportScreen() {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleContact = async () => {
    const email = 'support@workoutplanner.com';
    const subject = 'Workout Planner Support';
    const body = 'I need help with...';
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      await Linking.openURL(mailtoUrl);
    } catch (error) {
      console.error('Could not open email client:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: '#0f172a' }}
        contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header with Gradient Background */}
        <LinearGradient
          colors={['rgba(139, 92, 246, 0.15)', 'rgba(15, 23, 42, 0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 28 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              backgroundColor: 'rgba(51, 65, 85, 0.4)',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16,
            }}>
            <MaterialIcons name="arrow-back" size={24} color="#e2e8f0" />
          </TouchableOpacity>
          <Text style={{ fontSize: 32, fontWeight: '800', color: '#ffffff', marginBottom: 8 }}>
            Help & Support
          </Text>
          <Text style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 20 }}>
            Get answers to your questions and learn more about Workout Planner
          </Text>
        </LinearGradient>

        {/* Quick Links */}
        <View style={{ paddingHorizontal: 20, marginBottom: 32, marginTop: 12 }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 1,
                borderColor: 'rgba(59, 130, 246, 0.3)',
                borderRadius: 10,
                paddingVertical: 12,
                paddingHorizontal: 12,
                alignItems: 'center',
              }}>
              <MaterialIcons name="help-outline" size={20} color="#60a5fa" />
              <Text style={{ fontSize: 11, fontWeight: '600', color: '#60a5fa', marginTop: 4 }}>
                FAQ
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 1,
                borderColor: 'rgba(139, 92, 246, 0.3)',
                borderRadius: 10,
                paddingVertical: 12,
                paddingHorizontal: 12,
                alignItems: 'center',
              }}>
              <MaterialIcons name="code" size={20} color="#a78bfa" />
              <Text style={{ fontSize: 11, fontWeight: '600', color: '#a78bfa', marginTop: 4 }}>
                Developers
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderWidth: 1,
                borderColor: 'rgba(34, 197, 94, 0.3)',
                borderRadius: 10,
                paddingVertical: 12,
                paddingHorizontal: 12,
                alignItems: 'center',
              }}>
              <MaterialIcons name="construction" size={20} color="#22c55e" />
              <Text style={{ fontSize: 11, fontWeight: '600', color: '#22c55e', marginTop: 4 }}>
                Stack
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Version Card */}
        <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
          <LinearGradient
            colors={['rgba(6, 182, 212, 0.1)', 'rgba(6, 182, 212, 0.03)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 14,
              padding: 18,
              borderWidth: 1,
              borderColor: 'rgba(6, 182, 212, 0.2)',
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  backgroundColor: 'rgba(6, 182, 212, 0.2)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}>
                <MaterialIcons name="info" size={18} color="#06b6d4" />
              </View>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#ffffff' }}>
                App Information
              </Text>
            </View>
            <View style={{ paddingLeft: 48, gap: 10 }}>
              <View>
                <Text style={{ fontSize: 11, color: '#94a3b8', fontWeight: '500', marginBottom: 3 }}>
                  Version
                </Text>
                <Text style={{ fontSize: 15, fontWeight: '600', color: '#06b6d4' }}>1.0.0</Text>
              </View>
              <View>
                <Text style={{ fontSize: 11, color: '#94a3b8', fontWeight: '500', marginBottom: 3 }}>
                  Build
                </Text>
                <Text style={{ fontSize: 15, fontWeight: '600', color: '#06b6d4' }}>
                  {Constants.expoVersion || 'Latest'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* FAQ Section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#ffffff', marginBottom: 4 }}>
              Frequently Asked Questions
            </Text>
            <View
              style={{
                width: 40,
                height: 3,
                backgroundColor: 'rgba(139, 92, 246, 0.6)',
                borderRadius: 2,
              }}
            />
          </View>

          {FAQ_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => toggleFaq(item.id)}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                borderRadius: 12,
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderWidth: 1,
                borderColor: expandedFaq === item.id 
                  ? 'rgba(139, 92, 246, 0.4)'
                  : 'rgba(51, 65, 85, 0.5)',
                marginBottom: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: '#e2e8f0',
                    flex: 1,
                    marginRight: 12,
                  }}>
                  {item.question}
                </Text>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MaterialIcons
                    name={expandedFaq === item.id ? 'expand-less' : 'expand-more'}
                    size={18}
                    color="#a78bfa"
                  />
                </View>
              </View>

              {expandedFaq === item.id && (
                <Text
                  style={{
                    fontSize: 13,
                    color: '#cbd5e1',
                    marginTop: 12,
                    lineHeight: 20,
                    paddingTop: 12,
                    borderTopWidth: 1,
                    borderTopColor: 'rgba(139, 92, 246, 0.2)',
                  }}>
                  {item.answer}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Developer Details */}
        <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#ffffff', marginBottom: 4 }}>
              Development Team
            </Text>
            <View
              style={{
                width: 40,
                height: 3,
                backgroundColor: 'rgba(168, 85, 247, 0.6)',
                borderRadius: 2,
              }}
            />
          </View>

          {DEVELOPERS.map((dev, index) => (
            <LinearGradient
              key={index}
              colors={['rgba(168, 85, 247, 0.08)', 'rgba(168, 85, 247, 0.02)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 14,
                padding: 16,
                borderWidth: 1,
                borderColor: 'rgba(168, 85, 247, 0.2)',
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                <LinearGradient
                  colors={['rgba(168, 85, 247, 0.3)', 'rgba(139, 92, 246, 0.2)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 14,
                  }}>
                  <MaterialIcons name="person" size={26} color="#a78bfa" />
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: '#ffffff', marginBottom: 2 }}>
                    {dev.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#a78bfa', fontWeight: '600' }}>
                    {dev.role}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  paddingLeft: 66,
                  backgroundColor: 'rgba(168, 85, 247, 0.05)',
                  borderRadius: 8,
                  paddingVertical: 8,
                  paddingRight: 8,
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialIcons name="brush" size={14} color="#a78bfa" />
                  <Text style={{ fontSize: 12, color: '#cbd5e1', marginLeft: 6, fontWeight: '600' }}>
                    {dev.expertise}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          ))}
        </View>

        {/* Tech Stack */}
        <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#ffffff', marginBottom: 4 }}>
              Technology Stack
            </Text>
            <View
              style={{
                width: 40,
                height: 3,
                backgroundColor: 'rgba(34, 197, 94, 0.6)',
                borderRadius: 2,
              }}
            />
          </View>

          <View
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              borderRadius: 14,
              padding: 18,
              borderWidth: 1,
              borderColor: 'rgba(51, 65, 85, 0.5)',
            }}>
            {/* Frontend */}
            <View style={{ marginBottom: 18, paddingBottom: 18, borderBottomWidth: 1, borderBottomColor: 'rgba(51, 65, 85, 0.5)' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    backgroundColor: 'rgba(96, 165, 250, 0.2)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 10,
                  }}>
                  <MaterialIcons name="smartphone" size={14} color="#60a5fa" />
                </View>
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#60a5fa' }}>Frontend</Text>
              </View>
              <View style={{ paddingLeft: 38, gap: 6 }}>
                <Text style={{ fontSize: 12, color: '#cbd5e1', fontWeight: '500' }}>React Native</Text>
                <Text style={{ fontSize: 12, color: '#cbd5e1', fontWeight: '500' }}>Expo • TypeScript</Text>
                <Text style={{ fontSize: 12, color: '#cbd5e1', fontWeight: '500' }}>Tailwind CSS • NativeWind</Text>
              </View>
            </View>

            {/* Backend */}
            <View style={{ marginBottom: 18, paddingBottom: 18, borderBottomWidth: 1, borderBottomColor: 'rgba(51, 65, 85, 0.5)' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    backgroundColor: 'rgba(52, 211, 153, 0.2)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 10,
                  }}>
                  <MaterialIcons name="storage" size={14} color="#34d399" />
                </View>
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#34d399' }}>Backend</Text>
              </View>
              <View style={{ paddingLeft: 38, gap: 6 }}>
                <Text style={{ fontSize: 12, color: '#cbd5e1', fontWeight: '500' }}>FastAPI • Python</Text>
                <Text style={{ fontSize: 12, color: '#cbd5e1', fontWeight: '500' }}>PostgreSQL Database</Text>
                <Text style={{ fontSize: 12, color: '#cbd5e1', fontWeight: '500' }}>JWT Authentication</Text>
              </View>
            </View>

            {/* AI/ML */}
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    backgroundColor: 'rgba(251, 191, 36, 0.2)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 10,
                  }}>
                  <MaterialIcons name="auto-awesome" size={14} color="#fbbf24" />
                </View>
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#fbbf24' }}>AI/ML</Text>
              </View>
              <View style={{ paddingLeft: 38, gap: 6 }}>
                <Text style={{ fontSize: 12, color: '#cbd5e1', fontWeight: '500' }}>TensorFlow • Deep Learning</Text>
                <Text style={{ fontSize: 12, color: '#cbd5e1', fontWeight: '500' }}>Image Processing • OpenCV</Text>
                <Text style={{ fontSize: 12, color: '#cbd5e1', fontWeight: '500' }}>Food Recognition Model</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact Section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#ffffff', marginBottom: 4 }}>
              Contact & Support
            </Text>
            <View
              style={{
                width: 40,
                height: 3,
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderRadius: 2,
              }}
            />
          </View>

          <TouchableOpacity
            onPress={handleContact}
            activeOpacity={0.8}
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              borderWidth: 1.5,
              borderColor: '#3b82f6',
              borderRadius: 12,
              paddingVertical: 16,
              paddingHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
            }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}>
              <MaterialIcons name="email" size={18} color="#3b82f6" />
            </View>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#3b82f6' }}>
              Contact Support Team
            </Text>
          </TouchableOpacity>

          <LinearGradient
            colors={['rgba(51, 65, 85, 0.3)', 'rgba(51, 65, 85, 0.1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: 'rgba(51, 65, 85, 0.5)',
            }}>
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    backgroundColor: 'rgba(96, 165, 250, 0.15)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 10,
                  }}>
                  <MaterialIcons name="mail" size={14} color="#60a5fa" />
                </View>
                <View>
                  <Text style={{ fontSize: 11, color: '#94a3b8', fontWeight: '500' }}>Email</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#e2e8f0' }}>
                    support@workoutplanner.com
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 10,
                  }}>
                  <MaterialIcons name="location-on" size={14} color="#22c55e" />
                </View>
                <View>
                  <Text style={{ fontSize: 11, color: '#94a3b8', fontWeight: '500' }}>Location</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#e2e8f0' }}>
                    Developed in India
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Footer */}
        <View style={{ paddingHorizontal: 20, marginBottom: 8, marginTop: 8 }}>
          <View
            style={{
              backgroundColor: 'rgba(139, 92, 246, 0.08)',
              borderRadius: 12,
              paddingVertical: 16,
              paddingHorizontal: 14,
              borderWidth: 1,
              borderColor: 'rgba(139, 92, 246, 0.15)',
            }}>
            <Text style={{ fontSize: 13, color: '#cbd5e1', textAlign: 'center', lineHeight: 20, fontWeight: '500' }}>
              Thank you for using {'\n'}
              <Text style={{ color: '#a78bfa', fontWeight: '700' }}>Workout Planner!</Text>
              {'\n\n'}
              We're constantly innovating to deliver exceptional fitness tracking experiences.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
