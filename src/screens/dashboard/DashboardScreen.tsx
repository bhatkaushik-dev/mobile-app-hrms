import React from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, Card, SectionHeader } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { useAppNavigation } from '../../navigation/hooks';
import { menuSections, upcomingModules, type MenuItem } from './menu';

function greeting(): string {
  // Static buckets keep it deterministic; swap for real time-of-day if desired.
  return 'Welcome back';
}

export function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();
  const { user, signOut } = useAuth();

  const onItemPress = (item: MenuItem) => {
    if (item.soon || !item.route) {
      Alert.alert(item.label, 'This module is coming soon.');
      return;
    }
    navigation.navigate(item.route);
  };

  const confirmSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  return (
    <View className="flex-1 bg-surface-muted">
      {/* Brand header */}
      <View
        className="rounded-b-3xl bg-brand-600 px-5 pb-6"
        style={{ paddingTop: insets.top + 16 }}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Avatar name={user?.name ?? 'User'} size={48} />
            <View className="ml-3">
              <Text className="text-sm text-white/80">{greeting()},</Text>
              <Text className="text-lg font-bold text-white">
                {user?.name ?? 'User'}
              </Text>
            </View>
          </View>
          <Pressable
            hitSlop={8}
            onPress={confirmSignOut}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
            className="h-10 w-10 items-center justify-center rounded-full bg-white/15">
            <Text className="text-base">⏻</Text>
          </Pressable>
        </View>
        <Text className="mt-1 text-xs text-white/70">
          {user?.designation} · {user?.department}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <View className="px-4 pt-5">
          {menuSections.map(section => (
            <View key={section.title} className="mb-6">
              <SectionHeader title={section.title} />
              <View className="gap-3">
                {section.items.map(item => (
                  <Card key={item.key} onPress={() => onItemPress(item)}>
                    <View className="flex-row items-center">
                      <View className="h-11 w-11 items-center justify-center rounded-xl bg-brand-50">
                        <Text className="text-xl">{item.icon}</Text>
                      </View>
                      <View className="ml-3 flex-1">
                        <Text className="text-base font-semibold text-ink">
                          {item.label}
                        </Text>
                        <Text className="text-sm text-ink-muted">
                          {item.description}
                        </Text>
                      </View>
                      <Text className="text-xl text-ink-faint">›</Text>
                    </View>
                  </Card>
                ))}
              </View>
            </View>
          ))}

          {/* Breadth of the portal — visual parity with the web sidebar. */}
          <SectionHeader title="More Modules" />
          <View className="flex-row flex-wrap justify-between">
            {upcomingModules.map(item => (
              <Pressable
                key={item.key}
                onPress={() => onItemPress(item)}
                className="mb-3 w-[31%] items-center rounded-2xl border border-surface-border bg-white py-4 active:bg-surface-muted">
                <Text className="text-2xl">{item.icon}</Text>
                <Text className="mt-2 px-1 text-center text-xs font-medium text-ink">
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
