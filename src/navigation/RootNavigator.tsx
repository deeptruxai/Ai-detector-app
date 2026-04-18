import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { RootStackParamList, RootStackScreens } from './types';

import SplashScreen from '@/screens/Splash';
import LoginScreen from '@/screens/Auth/Login/Login';
import SignupScreen from '@/screens/Auth/SignUp/Signup';
import VerifyOTPScreen from '@/screens/Auth/VerifyOTP/VerifyOTP';
import HomeScreen from '@/screens/Home/HomeScreen';
import ProfileScreen from '@/screens/Profile';
import SettingsScreen from '@/screens/Settings';
import DashboardScreen from '@/screens/Dashboard';
import ScanningStatusScreen from '@/screens/Status/ScanningStatus';
import ImageDetectionScreen from '@/screens/Detection/ImageDetection';
import TextDetectionScreen from '@/screens/Detection/TextDetection';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={RootStackScreens.Splash}
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'android' ? 'default' : 'slide_from_right',
        freezeOnBlur: true,
        fullScreenGestureEnabled: true,
        gestureEnabled: true,
      }}>
      <Stack.Screen name={RootStackScreens.Splash} component={SplashScreen} />
      <Stack.Screen name={RootStackScreens.Login} component={LoginScreen} />
      <Stack.Screen name={RootStackScreens.Signup} component={SignupScreen} />
      <Stack.Screen name={RootStackScreens.VerifyOTP} component={VerifyOTPScreen} />
      <Stack.Screen name={RootStackScreens.Home} component={HomeScreen} />
      <Stack.Screen name={RootStackScreens.Dashboard} component={DashboardScreen} />
      <Stack.Screen name={RootStackScreens.Profile} component={ProfileScreen} />
      <Stack.Screen name={RootStackScreens.Settings} component={SettingsScreen} />
      <Stack.Screen name={RootStackScreens.ScanningStatus} component={ScanningStatusScreen} />
      <Stack.Screen name={RootStackScreens.ImageDetection} component={ImageDetectionScreen} />
      <Stack.Screen name={RootStackScreens.TextDetection} component={TextDetectionScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
