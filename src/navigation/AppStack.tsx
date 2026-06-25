import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { colors } from '../theme/colors';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { PersonalDetailsScreen } from '../screens/profile/PersonalDetailsScreen';
import { PayslipScreen } from '../screens/profile/PayslipScreen';
import { LeaveRequestScreen } from '../screens/leave/LeaveRequestScreen';
import { LeaveApplyScreen } from '../screens/leave/LeaveApplyScreen';
import { SmartObjectivesScreen } from '../screens/appraisals/SmartObjectivesScreen';
import { MyAppraisalsScreen } from '../screens/appraisals/MyAppraisalsScreen';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.white },
        headerTintColor: colors.ink,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.surfaceMuted },
      }}>
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PersonalDetails"
        component={PersonalDetailsScreen}
        options={{ title: 'Personal Details' }}
      />
      <Stack.Screen
        name="Payslip"
        component={PayslipScreen}
        options={{ title: 'Payslips' }}
      />
      <Stack.Screen
        name="LeaveRequest"
        component={LeaveRequestScreen}
        options={{ title: 'Leave Request' }}
      />
      <Stack.Screen
        name="LeaveApply"
        component={LeaveApplyScreen}
        options={{ title: 'Apply Leave' }}
      />
      <Stack.Screen
        name="SmartObjectives"
        component={SmartObjectivesScreen}
        options={{ title: 'Smart Objectives' }}
      />
      <Stack.Screen
        name="MyAppraisals"
        component={MyAppraisalsScreen}
        options={{ title: 'My Appraisals' }}
      />
    </Stack.Navigator>
  );
}
