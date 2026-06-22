import React from 'react';
import { Text, View } from 'react-native';

export type BadgeTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
}

const toneClasses: Record<BadgeTone, string> = {
  success: 'bg-green-100 text-success',
  warning: 'bg-amber-100 text-warning',
  danger: 'bg-red-100 text-danger',
  info: 'bg-blue-100 text-info',
  neutral: 'bg-gray-100 text-ink-muted',
};

/** Small status chip. The container and text share a tone color family. */
export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  const [bg, text] = toneClasses[tone].split(' ');
  return (
    <View className={`self-start rounded-full px-2.5 py-1 ${bg}`}>
      <Text className={`text-xs font-semibold ${text}`}>{label}</Text>
    </View>
  );
}
