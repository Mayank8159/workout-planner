import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";

interface PredictionResult {
  food_item: string;
  calories: number;
  confidence: number;
}

const API_BASE_URL = "http://localhost:8000";

export default function ScannerScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  if (!permission) {
    return <View className="flex-1 bg-gray-900" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center px-6">
        <MaterialIcons name="camera-alt" size={64} color="#9ca3af" />
        <Text className="text-white text-xl font-bold mt-4 text-center">
          Camera Permission Required
        </Text>
        <Text className="text-gray-400 text-center mt-2 mb-6">
          We need camera access to scan food items for calorie detection
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-blue-600 rounded-lg py-3 px-8"
        >
          <Text className="text-white font-bold text-center">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setIsLoading(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });

        if (photo) {
          setCapturedImage(photo.uri);
          setIsCameraActive(false);
          await sendImageToBackend(photo.uri);
        }
      } catch (error) {
        console.error("Error taking picture:", error);
        Alert.alert("Error", "Failed to take picture");
        setIsLoading(false);
      }
    }
  };

  const sendImageToBackend = async (imageUri: string) => {
    try {
      const formData = new FormData();

      // Create a File-like object from the image URI
      const response = await fetch(imageUri);
      const blob = await response.blob();

      formData.append("image", blob as any, "photo.jpg");

      const backendResponse = await axios.post(
        `${API_BASE_URL}/predict`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        }
      );

      if (backendResponse.data) {
        setPredictionResult(backendResponse.data);
        setShowResultModal(true);
        setError(null);
      }
    } catch (error: any) {
      console.error("Error sending image:", error);
      let errorMessage = "Failed to process image";

      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetakePhoto = () => {
    setCapturedImage(null);
    setPredictionResult(null);
    setShowResultModal(false);
    setError(null);
    setIsCameraActive(true);
  };

  const handleSaveResult = () => {
    if (predictionResult) {
      Alert.alert(
        "Success",
        `${predictionResult.food_item} (${predictionResult.calories} calories) saved!`
      );
      handleRetakePhoto();
    }
  };

  return (
    <View className="flex-1 bg-gray-900">
      {isCameraActive ? (
        <>
          <CameraView
            ref={cameraRef}
            className="flex-1"
            facing="back"
            autofocus="on"
            enableTorch={false}
          />

          {/* Overlay Controls */}
          <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-6 items-center">
            <Text className="text-white text-center mb-4 text-base">
              Point camera at food to detect calories
            </Text>
            <TouchableOpacity
              onPress={takePicture}
              disabled={isLoading}
              className="bg-blue-600 rounded-full p-4 w-16 h-16 items-center justify-center"
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <MaterialIcons name="photo-camera" size={32} color="white" />
              )}
            </TouchableOpacity>
          </View>

          {/* Header */}
          <View className="absolute top-0 left-0 right-0 bg-black/50 p-6">
            <Text className="text-white text-3xl font-bold">Scanner</Text>
            <Text className="text-gray-300 text-sm mt-1">
              Calorie Detection
            </Text>
          </View>
        </>
      ) : (
        <View className="flex-1 justify-center items-center px-6">
          {capturedImage && (
            <Image
              source={{ uri: capturedImage }}
              className="w-64 h-64 rounded-lg"
            />
          )}
          {isLoading && (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text className="text-white mt-4">Analyzing food item...</Text>
            </View>
          )}
        </View>
      )}

      {/* Result Modal */}
      <Modal
        visible={showResultModal && !isLoading}
        transparent
        animationType="slide"
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-gray-900 rounded-t-3xl p-6 pb-10">
            <TouchableOpacity
              onPress={() => setShowResultModal(false)}
              className="mb-4"
            >
              <MaterialIcons name="close" size={24} color="white" />
            </TouchableOpacity>

            {error && (
              <View className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
                <Text className="text-red-400">{error}</Text>
              </View>
            )}

            {predictionResult && (
              <>
                <Text className="text-2xl font-bold text-white mb-4">
                  Detection Result
                </Text>

                <View className="bg-gray-800 rounded-lg p-6 mb-6">
                  <View className="mb-6">
                    <Text className="text-gray-400 text-sm mb-2">Food Item</Text>
                    <Text className="text-white text-2xl font-bold">
                      {predictionResult.food_item}
                    </Text>
                  </View>

                  <View className="bg-gray-700 rounded-lg p-4 mb-6">
                    <Text className="text-gray-400 text-sm mb-2">Calories</Text>
                    <Text className="text-green-400 text-3xl font-bold">
                      {predictionResult.calories}
                    </Text>
                  </View>

                  <View>
                    <Text className="text-gray-400 text-sm mb-2">
                      Confidence
                    </Text>
                    <View className="bg-gray-700 rounded-full h-2 overflow-hidden">
                      <View
                        className="bg-blue-500 h-full"
                        style={{
                          width: `${predictionResult.confidence * 100}%`,
                        }}
                      />
                    </View>
                    <Text className="text-white mt-2">
                      {(predictionResult.confidence * 100).toFixed(1)}%
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={handleRetakePhoto}
                    className="flex-1 bg-gray-700 rounded-lg py-3"
                  >
                    <Text className="text-white font-bold text-center">
                      Retake
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSaveResult}
                    className="flex-1 bg-green-600 rounded-lg py-3"
                  >
                    <Text className="text-white font-bold text-center">
                      Save Result
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
