import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Pressable } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console
    console.error('🔴 Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center bg-slate-900 p-6">
          <View className="bg-slate-800 rounded-2xl p-6 w-full max-w-md">
            <Text className="text-2xl font-bold text-red-500 mb-4 text-center">
              Oops! Something went wrong
            </Text>
            
            <Text className="text-slate-300 text-base mb-4 text-center">
              The app encountered an unexpected error. This usually happens due to network issues or configuration problems.
            </Text>
            
            {this.state.error && (
              <View className="bg-slate-900 rounded-lg p-4 mb-4">
                <Text className="text-red-400 text-sm font-mono">
                  {this.state.error.toString()}
                </Text>
              </View>
            )}
            
            <Pressable
              onPress={this.handleReset}
              className="bg-blue-600 rounded-xl py-4 px-6"
            >
              <Text className="text-white text-center font-semibold text-base">
                Try Again
              </Text>
            </Pressable>
            
            <Text className="text-slate-500 text-xs mt-4 text-center">
              If the problem persists, check your internet connection and try restarting the app.
            </Text>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
