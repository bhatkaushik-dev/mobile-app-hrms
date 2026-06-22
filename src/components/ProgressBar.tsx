import React from 'react';
import { View } from 'react-native';

interface ProgressBarProps {
  /** 0-100 */
  value: number;
  tone?: 'brand' | 'success' | 'info';
}

const fillTone = {
  brand: 'bg-brand-600',
  success: 'bg-success',
  info: 'bg-info',
};

export function ProgressBar({ value, tone = 'brand' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <View className="h-2 w-full overflow-hidden rounded-full bg-surface-border">
      <View
        className={`h-full rounded-full ${fillTone[tone]}`}
        style={{ width: `${clamped}%` }}
      />
    </View>
  );
}
