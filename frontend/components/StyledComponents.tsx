import React from 'react';
import {
  View as RNView,
  Text as RNText,
  ScrollView as RNScrollView,
  TextInput as RNTextInput,
  TouchableOpacity as RNTouchableOpacity,
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  Image as RNImage,
  SafeAreaView as RNSafeAreaView,
} from 'react-native';

// View component with NativeWind support
export const View = React.forwardRef<any, any>(
  ({ className, ...rest }, ref) => (
    <RNView ref={ref} className={className} {...rest} />
  )
);
View.displayName = 'View';

// Text component with NativeWind support
export const Text = React.forwardRef<any, any>(
  ({ className, ...rest }, ref) => (
    <RNText ref={ref} className={className} {...rest} />
  )
);
Text.displayName = 'Text';

// ScrollView component with NativeWind support
export const ScrollView = React.forwardRef<any, any>(
  ({ className, ...rest }, ref) => (
    <RNScrollView ref={ref} className={className} {...rest} />
  )
);
ScrollView.displayName = 'ScrollView';

// TextInput component with NativeWind support
export const TextInput = React.forwardRef<any, any>(
  ({ className, ...rest }, ref) => (
    <RNTextInput ref={ref} className={className} {...rest} />
  )
);
TextInput.displayName = 'TextInput';

// TouchableOpacity component with NativeWind support
export const TouchableOpacity = React.forwardRef<any, any>(
  ({ className, ...rest }, ref) => (
    <RNTouchableOpacity ref={ref} className={className} {...rest} />
  )
);
TouchableOpacity.displayName = 'TouchableOpacity';

// KeyboardAvoidingView component with NativeWind support
export const KeyboardAvoidingView = React.forwardRef<any, any>(
  ({ className, ...rest }, ref) => (
    <RNKeyboardAvoidingView ref={ref} className={className} {...rest} />
  )
);
KeyboardAvoidingView.displayName = 'KeyboardAvoidingView';

// Image component with NativeWind support
export const Image = React.forwardRef<any, any>(
  ({ className, ...rest }, ref) => (
    <RNImage ref={ref} className={className} {...rest} />
  )
);
Image.displayName = 'Image';

// SafeAreaView component with NativeWind support
export const SafeAreaView = React.forwardRef<any, any>(
  ({ className, ...rest }, ref) => (
    <RNSafeAreaView ref={ref} className={className} {...rest} />
  )
);
SafeAreaView.displayName = 'SafeAreaView';
