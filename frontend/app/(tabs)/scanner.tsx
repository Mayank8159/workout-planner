import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  SafeAreaView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useUser } from '@/context/UserContext';
import { ScannerLaser } from '@/components/ScannerLaser';
import { ScanResultModal } from '@/components/ScanResultModal';
import { API_BASE_URL } from '@/utils/api';

interface PredictionResult {
  food_item: string;
  calories: number;
  confidence: number;
  macros: {
    carbs: number;
    protein: number;
    fat: number;
  };
}

export default function ScannerScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const { user, token } = useUser();

  if (!permission) {
    return (
      <SafeAreaView className="flex-1 bg-slate-900">
        <LinearGradient colors={['#0f172a', '#1e293b']} className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#7c3aed" />
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-slate-900">
        <LinearGradient 
          colors={['#0f172a', '#1e293b']} 
          className="flex-1 justify-center items-center"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <View style={{
            borderRadius: 20,
            padding: 28,
            alignItems: 'center',
            backgroundColor: 'rgba(249, 115, 22, 0.08)',
            borderWidth: 1,
            borderColor: 'rgba(249, 115, 22, 0.25)',
            marginHorizontal: 24,
          }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: 'rgba(249, 115, 22, 0.15)',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
              borderWidth: 2,
              borderColor: 'rgba(249, 115, 22, 0.3)',
            }}>
              <MaterialIcons name="camera-alt" size={44} color="#f97316" />
            </View>
            <Text className="text-white text-2xl font-bold mt-4 text-center mb-3">
              Camera Permission Required
            </Text>
            <Text className="text-slate-300 text-center mt-2 mb-8 text-base leading-6">
              We need camera access to scan food items and detect calories using AI
            </Text>
            <TouchableOpacity onPress={requestPermission}>
              <LinearGradient
                colors={['rgba(249, 115, 22, 0.25)', 'rgba(249, 115, 22, 0.15)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 14,
                  paddingVertical: 16,
                  paddingHorizontal: 32,
                  borderWidth: 2,
                  borderColor: '#f97316',
                  shadowColor: '#f97316',
                  shadowOpacity: 0.4,
                  shadowRadius: 10,
                  elevation: 8,
                }}>
                <Text className="text-orange-400 text-lg font-bold text-center">
                  Grant Permission
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current && !isLoading) {
      try {
        setIsScanning(true);
        setIsLoading(true);
        
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });

        if (photo) {
          setCapturedImage(photo.uri);
          await sendImageToBackend(photo.uri);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture');
        setIsLoading(false);
        setIsScanning(false);
      }
    }
  };

  const sendImageToBackend = async (imageUri: string) => {
    try {
      const formData = new FormData();
      const response = await fetch(imageUri);
      const blob = await response.blob();
      formData.append('file', blob as any, 'photo.jpg');

      const backendResponse = await axios.post(
        `${API_BASE_URL}/scan/`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          timeout: 30000,
        }
      );

      if (backendResponse.data) {
        // Ensure we have valid nutrition data
        const result = {
          ...backendResponse.data,
          macros: {
            carbs: backendResponse.data.carbs || 0,
            protein: backendResponse.data.protein || 0,
            fat: backendResponse.data.fat || 0,
          },
        };
        setPredictionResult(result);
        setShowResultModal(true);
      }
    } catch (error: any) {
      console.error('Error sending image:', error);
      
      // Handle specific error messages from backend
      let errorMessage = 'Failed to process image';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.status === 400) {
        errorMessage = 'Please scan a food item. The image does not appear to contain food.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error processing image. Please try again.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      }
      
      Alert.alert('⚠️ Not a Food Item', errorMessage, [
        {
          text: 'Try Again',
          onPress: () => {
            setCapturedImage(null);
          },
        },
      ]);
    } finally {
      setIsScanning(false);
      setIsLoading(false);
    }
  };

  const handleAddToLog = async () => {
    if (!predictionResult) return;

    try {
      // Food is already saved to database by the /scan endpoint
      // Just show success and close the modal
      Alert.alert('✓ Added to Log', `${predictionResult.food_item} has been logged for today!`, [
        {
          text: 'OK',
          onPress: () => {
            handleClose();
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to close. Please try again.');
    }
  };

  const handleClose = () => {
    setShowResultModal(false);
    setCapturedImage(null);
    setPredictionResult(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="flex-1 bg-slate-900 pb-32">
        {!capturedImage ? (
          <>
            <CameraView
              ref={cameraRef}
              className="flex-1"
              facing="back"
              autofocus="on"
            >
              {/* Scanner Frame */}
              <View className="flex-1 justify-center items-center pt-6">
                <View className="w-80 h-80 border-4 border-orange-400 rounded-3xl overflow-hidden" style={{ borderColor: '#f97316' }}>
                  {isScanning && <ScannerLaser />}
                </View>
                <Text className="text-white text-center mt-8 text-lg px-8 font-semibold">
                  Position food within the frame
                </Text>
              </View>
            </CameraView>

            {/* Header */}
            <View className="absolute top-0 left-0 right-0 pt-4 pb-6 px-6">
              <LinearGradient
                colors={['rgba(249, 115, 22, 0.15)', 'rgba(249, 115, 22, 0.05)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: 'rgba(249, 115, 22, 0.3)',
                }}>
                <Text className="text-white text-3xl font-bold">Food Scanner</Text>
                <Text className="text-slate-300 text-sm mt-1">AI-powered calorie detection</Text>
              </LinearGradient>
            </View>

            {/* Bottom Controls */}
            <View className="absolute bottom-0 left-0 right-0 pb-24 px-6">
              <LinearGradient
                colors={['rgba(15, 23, 42, 0.4)', 'rgba(15, 23, 42, 0.85)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  paddingVertical: 20,
                  alignItems: 'center',
                  borderTopWidth: 1,
                  borderTopColor: 'rgba(249, 115, 22, 0.2)',
                }}>
                <TouchableOpacity
                  onPress={takePicture}
                  disabled={isLoading}
                  className="items-center"
                >
                  <View
                    className="rounded-full w-24 h-24 items-center justify-center"
                    style={{
                      backgroundColor: '#f97316',
                      borderWidth: 4,
                      borderColor: '#fed7aa',
                      shadowColor: '#f97316',
                      shadowOpacity: 0.6,
                      shadowRadius: 16,
                      elevation: 12,
                    }}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#ffffff" size="large" />
                    ) : (
                      <MaterialIcons name="photo-camera" size={44} color="#ffffff" />
                    )}
                  </View>
                </TouchableOpacity>
                {isLoading && (
                  <Text className="text-orange-300 text-center mt-6 font-bold text-lg">
                    Analyzing image...
                  </Text>
                )}
              </LinearGradient>
            </View>
          </>
        ) : (
          <View className="flex-1 justify-center items-center bg-slate-900">
            <Image source={{ uri: capturedImage }} className="w-full h-96" resizeMode="contain" />
            {isLoading && (
              <View className="mt-8">
                <ActivityIndicator size="large" color="#f97316" />
                <Text className="text-slate-300 mt-6 font-semibold text-center">Processing image...</Text>
              </View>
            )}
            
            {!isLoading && (
              <View className="absolute bottom-0 left-0 right-0 pb-20 px-6">
                <LinearGradient
                  colors={['rgba(15, 23, 42, 0.4)', 'rgba(15, 23, 42, 0.95)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    paddingVertical: 20,
                    paddingHorizontal: 16,
                    borderTopWidth: 1,
                    borderTopColor: 'rgba(249, 115, 22, 0.2)',
                  }}>
                  <View className="flex-row justify-between gap-4">
                    <TouchableOpacity
                      onPress={() => setCapturedImage(null)}
                      className="flex-1"
                    >
                      <LinearGradient
                        colors={['rgba(71, 85, 105, 0.4)', 'rgba(51, 65, 85, 0.6)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          borderRadius: 16,
                          paddingVertical: 16,
                          alignItems: 'center',
                          borderWidth: 1,
                          borderColor: 'rgba(100, 116, 139, 0.3)',
                        }}>
                        <MaterialIcons name="close" size={24} color="#e2e8f0" />
                        <Text className="text-slate-200 font-bold mt-2">Retake</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      onPress={takePicture}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      <LinearGradient
                        colors={['rgba(249, 115, 22, 0.2)', 'rgba(249, 115, 22, 0.1)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          borderRadius: 16,
                          paddingVertical: 16,
                          alignItems: 'center',
                          borderWidth: 2,
                          borderColor: '#f97316',
                          shadowColor: '#f97316',
                          shadowOpacity: 0.4,
                          shadowRadius: 8,
                          elevation: 8,
                        }}>
                        <MaterialIcons name="check-circle" size={24} color="#f97316" />
                        <Text className="text-orange-400 font-bold mt-2">Analyze</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            )}
          </View>
        )}

        {/* Result Modal */}
        {predictionResult && (
          <ScanResultModal
            visible={showResultModal}
            onClose={handleClose}
            onAddToLog={handleAddToLog}
            foodName={predictionResult.food_item}
            calories={predictionResult.calories}
            macros={predictionResult.macros}
            confidence={predictionResult.confidence}
            loading={isLoading}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
