import 'nativewind';

// Extend React Native component props to support className
declare global {
  namespace JSX {
    interface IntrinsicElements {
      View: any;
      Text: any;
      ScrollView: any;
      Image: any;
      TouchableOpacity: any;
      KeyboardAvoidingView: any;
      TextInput: any;
      FlatList: any;
    }
  }
}

// Augment React Native module
declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }

  interface TextProps {
    className?: string;
  }

  interface ScrollViewProps {
    className?: string;
  }

  interface ImageProps {
    className?: string;
  }

  interface TouchableOpacityProps {
    className?: string;
  }

  interface KeyboardAvoidingViewProps {
    className?: string;
  }

  interface TextInputProps {
    className?: string;
  }

  interface FlatListProps<ItemT> {
    className?: string;
  }

  interface SafeAreaViewProps {
    className?: string;
  }

  interface PressableProps {
    className?: string;
  }
}

// Augment expo-camera module
declare module 'expo-camera' {
  interface CameraViewProps {
    className?: string;
    type?: any;
  }
}

export {};
