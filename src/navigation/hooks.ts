import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from './types';

/** Typed navigation for screens inside the app stack. */
export function useAppNavigation() {
  return useNavigation<NativeStackNavigationProp<AppStackParamList>>();
}
