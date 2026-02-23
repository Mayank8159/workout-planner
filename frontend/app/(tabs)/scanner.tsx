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
        <LinearGradient colors={['#0f172a', '#1e293b']} className="flex-1 justify-center items-center px-6">
          <View className="bg-slate-800 rounded-full p-6 mb-6">
              <MaterialIcons name="camera-alt" size={36} color="#E5E7EB" />
          </View>
          <Text className="text-white text-2xl font-bold mt-4 text-center mb-2">
            Camera Permission Required
          </Text>
          <Text className="text-slate-400 text-center mt-2 mb-8 px-4">
            We need camera access to scan food items for calorie detection
          </Text>
          <TouchableOpacity onPress={requestPermission}>
          <View
            className="rounded-2xl py-4 px-8 bg-gray-300 border-2 border-gray-400"
            style={{ shadowColor: '#000000', shadowOpacity: 0.45, shadowRadius: 10, elevation: 8 }}
          >
            <Text className="text-gray-800 text-lg font-bold">Grant Permission</Text>
          </View>
        </TouchableOpacity>
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
      formData.append('image', blob as any, 'photo.jpg');

      const backendResponse = await axios.post(
        `${API_BASE_URL}/scan/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
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
                <View className="w-80 h-80 border-4 border-gray-400 rounded-3xl overflow-hidden">
                  {isScanning && <ScannerLaser />}
                </View>
                <Text className="text-white text-center mt-6 text-lg px-8">
                  Position food within the frame
                </Text>
              </View>
            </CameraView>

            {/* Header */}
            <View className="absolute top-0 left-0 right-0 pt-4 pb-6 px-6 bg-slate-900/80">
              <Text className="text-white text-3xl font-bold">AI Scanner</Text>
              <Text className="text-slate-400 text-sm mt-1">Scan food to track calories</Text>
            </View>

          {/* Bottom Controls */}
          <View className="absolute bottom-0 left-0 right-0 pb-24 px-6 bg-slate-900/80 pt-6">
            <TouchableOpacity
              onPress={takePicture}
              disabled={isLoading}
              className="items-center"
            >
              <View
                className="rounded-full w-20 h-20 items-center justify-center"
                style={{
                  backgroundColor: '#E5E7EB',
                  borderWidth: 2,
                  borderColor: '#D1D5DB',
                  shadowColor: '#000000',
                  shadowOpacity: 0.6,
                  shadowRadius: 10,
                  elevation: 10,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#6B21A8" />
                ) : (
                  <MaterialIcons name="photo-camera" size={40} color="#6B21A8" />
                )}
              </View>
            </TouchableOpacity>
            {isLoading && (
              <Text className="text-gray-300 text-center mt-4 font-semibold">
                Analyzing...
              </Text>
            )}
          </View>
        </>
      ) : (
        <View className="flex-1 justify-center items-center bg-slate-900">
          <Image source={{ uri: capturedImage }} className="w-full h-96" resizeMode="contain" />
          {isLoading && (
            <View className="mt-6">
              <ActivityIndicator size="large" color="#E5E7EB" />
              <Text className="text-gray-300 mt-4">Processing image...</Text>
            </View>
          )}
          
          {!isLoading && (
            <View className="absolute bottom-0 left-0 right-0 pb-20 px-6 bg-slate-900/80 pt-6 flex-row justify-between gap-3">
              <TouchableOpacity
                onPress={() => setCapturedImage(null)}
                className="flex-1"
              >
                <View
                  className="rounded-2xl py-4 items-center bg-slate-700 border-2 border-slate-600"
                  style={{ shadowColor: '#000000', shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 }}
                >
                  <Text className="text-white font-bold">Retake</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={takePicture}
                disabled={isLoading}
                className="flex-1"
              >
                <View
                  className="rounded-2xl py-4 items-center bg-gray-300 border-2 border-gray-400"
                  style={{ shadowColor: '#000000', shadowOpacity: 0.45, shadowRadius: 10, elevation: 8 }}
                >
                  <Text className="text-gray-800 font-bold">Analyze</Text>
                </View>
              </TouchableOpacity>
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
