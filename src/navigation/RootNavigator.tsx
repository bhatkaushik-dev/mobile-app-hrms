import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { LoadingView } from '../components';
import { useAuth } from '../context/AuthContext';
import { AppStack } from './AppStack';
import { AuthStack } from './AuthStack';

/**
 * Picks the flow based on auth status. While the persisted session is being
 * restored we show a splash spinner so we never flash the sign-in screen.
 */
export function RootNavigator() {
  const { status } = useAuth();

  return (
    <NavigationContainer>
      {status === 'loading' ? (
        <View className="flex-1 bg-surface-muted">
          <LoadingView label="Starting up…" />
        </View>
      ) : status === 'signedIn' ? (
        <AppStack />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
