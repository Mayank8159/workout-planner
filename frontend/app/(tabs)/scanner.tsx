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
import { useFoodLogging } from "@/hooks/useFoodLogging";
import { useUser } from "@/context/UserContext";

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
  const { addingFood, logMealFromPrediction } = useFoodLogging();
  const { user } = useUser();

  if (!permission) {
    return <View className="flex-1 bg-gray-900" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-dark-bg justify-center items-center px-6">
        <MaterialIcons name="camera-alt" size={64} color="#06b6d4" />
        <Text className="text-cyan-400 text-xl font-bold mt-4 text-center">
          Camera Permission Required
        </Text>
        <Text className="text-cyan-300 text-center mt-2 mb-6">
          We need camera access to scan food items for calorie detection
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={{
            backgroundColor: 'rgba(168, 85, 247, 0.8)',
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 32,
            shadowColor: '#a855f7',
            shadowOpacity: 0.6,
            shadowRadius: 15,
          }}
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

  const handleSaveResult = async () => {
    if (predictionResult && user?.id) {
      // Show confirmation prompt
      Alert.alert(
        "Add to Log?",
        `We found '${predictionResult.food_item}' (~${predictionResult.calories} kcal). Add to today's log?`,
        [
          { text: "Cancel", onPress: () => {} },
          {
            text: "Add",
            onPress: async () => {
              try {
                // Optimistic update - show immediate feedback
                Alert.alert(
                  "Added",
                  `${predictionResult.food_item} (${predictionResult.calories} calories) added to today's log!`
                );

                // Send to backend
                await logMealFromPrediction({
                  foodItem: predictionResult.food_item,
                  calories: predictionResult.calories,
                  confidence: predictionResult.confidence,
                  date: new Date().toISOString(),
                });

                handleRetakePhoto();
              } catch (error) {
                Alert.alert(
                  "Error",
                  "Failed to add meal to log. Please try again."
                );
                console.error("Failed to log meal:", error);
              }
            },
          },
        ]
      );
    }
  };

  return (
    <View className="flex-1 bg-dark-bg">
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
          <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(10, 14, 39, 0.7)',
            paddingHorizontal: 24,
            paddingVertical: 24,
            alignItems: 'center',
            borderTopWidth: 1,
            borderTopColor: 'rgba(168, 85, 247, 0.2)',
          }}>
            <Text className="text-cyan-400 text-center mb-4 text-base">
              Point camera at food to detect calories
            </Text>
            <TouchableOpacity
              onPress={takePicture}
              disabled={isLoading}
              style={{
                backgroundColor: 'rgba(168, 85, 247, 0.8)',
                borderRadius: 50,
                padding: 16,
                width: 64,
                height: 64,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#a855f7',
                shadowOpacity: 0.8,
                shadowRadius: 15,
              }}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <MaterialIcons name="photo-camera" size={32} color="white" />
              )}
            </TouchableOpacity>
          </View>

          {/* Header */}
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(10, 14, 39, 0.6)',
            paddingHorizontal: 24,
            paddingVertical: 24,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(168, 85, 247, 0.2)',
          }}>
            <Text className="text-cyan-400 text-3xl font-bold">Scanner</Text>
            <Text className="text-cyan-300 text-sm mt-1">
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
              <ActivityIndicator size="large" color="#a855f7" />
              <Text className="text-cyan-400 mt-4">Analyzing food item...</Text>
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
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end',
        }}>
          <View style={{
            backgroundColor: '#0a0e27',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingHorizontal: 24,
            paddingVertical: 24,
            paddingBottom: 40,
            borderTopWidth: 1,
            borderTopColor: 'rgba(168, 85, 247, 0.2)',
            shadowColor: '#a855f7',
            shadowOpacity: 0.3,
            shadowRadius: 15,
          }}>
            <TouchableOpacity
              onPress={() => setShowResultModal(false)}
              className="mb-4"
            >
              <MaterialIcons name="close" size={24} color="#a855f7" />
            </TouchableOpacity>

            {error && (
              <View style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 1,
                borderColor: 'rgba(239, 68, 68, 0.5)',
                borderRadius: 12,
                padding: 16,
                marginBottom: 24,
              }}>
                <Text className="text-pink-400">{error}</Text>
              </View>
            )}

            {predictionResult && (
              <>
                <Text className="text-2xl font-bold text-cyan-400 mb-4">
                  Detection Result
                </Text>

                <View style={{
                  backgroundColor: 'rgba(26, 31, 58, 0.5)',
                  borderRadius: 16,
                  padding: 24,
                  marginBottom: 24,
                  borderWidth: 1,
                  borderColor: 'rgba(168, 85, 247, 0.2)',
                  shadowColor: '#a855f7',
                  shadowOpacity: 0.4,
                  shadowRadius: 10,
                }}>
                  <View className="mb-6">
                    <Text className="text-cyan-300 text-sm mb-2">Food Item</Text>
                    <Text className="text-white text-2xl font-bold">
                      {predictionResult.food_item}
                    </Text>
                  </View>

                  <View style={{
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 24,
                    borderWidth: 1,
                    borderColor: 'rgba(6, 182, 212, 0.3)',
                  }}>
                    <Text className="text-cyan-300 text-sm mb-2">Calories</Text>
                    <Text className="text-cyan-400 text-3xl font-bold">
                      {predictionResult.calories}
                    </Text>
                  </View>

                  <View>
                    <Text className="text-cyan-300 text-sm mb-2">
                      Confidence
                    </Text>
                    <View style={{
                      backgroundColor: 'rgba(26, 31, 58, 0.7)',
                      borderRadius: 9999,
                      height: 8,
                      overflow: 'hidden',
                      borderWidth: 1,
                      borderColor: 'rgba(168, 85, 247, 0.2)',
                    }}>
                      <View
                        style={{
                          backgroundColor: '#a855f7',
                          height: '100%',
                          width: `${predictionResult.confidence * 100}%`,
                          shadowColor: '#a855f7',
                          shadowOpacity: 0.6,
                          shadowRadius: 8,
                        }}
                      />
                    </View>
                    <Text className="text-cyan-400 mt-2">
                      {(predictionResult.confidence * 100).toFixed(1)}%
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={handleRetakePhoto}
                    disabled={addingFood}
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(26, 31, 58, 0.8)',
                      borderRadius: 12,
                      paddingVertical: 12,
                      borderWidth: 1,
                      borderColor: 'rgba(14, 165, 233, 0.3)',
                    }}
                  >
                    <Text className="text-cyan-400 font-bold text-center">
                      Retake
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSaveResult}
                    disabled={addingFood}
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(168, 85, 247, 0.8)',
                      borderRadius: 12,
                      paddingVertical: 12,
                      shadowColor: '#a855f7',
                      shadowOpacity: 0.6,
                      shadowRadius: 10,
                    }}
                  >
                    {addingFood ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-white font-bold text-center">
                        Add to Log
                      </Text>
                    )}
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
