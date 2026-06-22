import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { colors } from '../theme/colors';

/** Centered spinner for initial data loads. */
export function LoadingView({ label = 'Loading…' }: { label?: string }) {
  return (
    <View className="items-center justify-center py-16">
      <ActivityIndicator color={colors.brand} size="large" />
      <Text className="mt-3 text-sm text-ink-muted">{label}</Text>
    </View>
  );
}

interface EmptyViewProps {
  icon?: string;
  title: string;
  subtitle?: string;
}

/** Friendly empty state, mirroring the web portal's "No Data Found" panel. */
export function EmptyView({ icon = '📭', title, subtitle }: EmptyViewProps) {
  return (
    <View className="items-center justify-center py-16">
      <Text className="text-5xl">{icon}</Text>
      <Text className="mt-3 text-base font-semibold text-ink">{title}</Text>
      {subtitle ? (
        <Text className="mt-1 px-8 text-center text-sm text-ink-muted">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
