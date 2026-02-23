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
          <ActivityIndicator size="large" color="#10b981" />
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-slate-900">
        <LinearGradient colors={['#0f172a', '#1e293b']} className="flex-1 justify-center items-center px-6">
          <View className="bg-slate-800 rounded-full p-6 mb-6">
            <MaterialIcons name="camera-alt" size={64} color="#10b981" />
          </View>
          <Text className="text-white text-2xl font-bold mt-4 text-center mb-2">
            Camera Permission Required
          </Text>
          <Text className="text-slate-400 text-center mt-2 mb-8 px-4">
            We need camera access to scan food items for calorie detection
          </Text>
          <TouchableOpacity onPress={requestPermission}>
          <LinearGradient
            colors={['#10b981', '#059669']}
            className="rounded-2xl py-4 px-8"
            style={{ shadowColor: '#10b981', shadowOpacity: 0.4, shadowRadius: 10, elevation: 5 }}
          >
            <Text className="text-slate-900 text-lg font-bold">Grant Permission</Text>
          </LinearGradient>
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
      } finally {
        setIsScanning(false);
        setIsLoading(false);
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
        `${API_BASE_URL}/scan/predict`,
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
        // Mock macros if not provided by backend
        const result = {
          ...backendResponse.data,
          macros: backendResponse.data.macros || {
            carbs: 45,
            protein: 25,
            fat: 12,
          },
        };
        setPredictionResult(result);
        setShowResultModal(true);
      }
    } catch (error: any) {
      console.error('Error sending image:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to process image';
      Alert.alert('Error', errorMessage);
    }
  };

  const handleAddToLog = async () => {
    if (!predictionResult) return;

    try {
      await axios.post(
        `${API_BASE_URL}/data/log`,
        {
          date: new Date().toISOString().split('T')[0],
          food_item: predictionResult.food_item,
          calories: predictionResult.calories,
          ...predictionResult.macros,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      Alert.alert('Success', `${predictionResult.food_item} added to your daily log!`);
      handleClose();
    } catch (error: any) {
      Alert.alert('Error', 'Failed to add to log. Please try again.');
    }
  };

  const handleClose = () => {
    setShowResultModal(false);
    setCapturedImage(null);
    setPredictionResult(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="flex-1 bg-slate-900">
        {!capturedImage ? (
          <>
            <CameraView
              ref={cameraRef}
              className="flex-1"
              facing="back"
              autofocus="on"
            >
              {/* Scanner Frame */}
              <View className="flex-1 justify-center items-center">
                <View className="w-80 h-80 border-4 border-emerald-500 rounded-3xl overflow-hidden">
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
              <Text className="text-slate-400 text-sm mt-1">Point at food to detect calories</Text>
            </View>

          {/* Bottom Controls */}
          <View className="absolute bottom-0 left-0 right-0 pb-10 px-6 bg-slate-900/80 pt-6">
            <TouchableOpacity
              onPress={takePicture}
              disabled={isLoading}
              className="items-center"
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                className="rounded-full w-20 h-20 items-center justify-center"
                style={{ shadowColor: '#10b981', shadowOpacity: 0.6, shadowRadius: 15, elevation: 8 }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#0f172a" />
                ) : (
                  <MaterialIcons name="photo-camera" size={40} color="#0f172a" />
                )}
              </LinearGradient>
            </TouchableOpacity>
            {isLoading && (
              <Text className="text-emerald-500 text-center mt-4 font-semibold">
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
              <ActivityIndicator size="large" color="#10b981" />
              <Text className="text-slate-400 mt-4">Processing image...</Text>
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
