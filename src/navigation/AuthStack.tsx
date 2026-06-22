import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SignInScreen } from '../screens/auth/SignInScreen';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
    </Stack.Navigator>
  );
}
