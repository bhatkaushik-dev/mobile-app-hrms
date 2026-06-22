import React from 'react';
import { Text, View } from 'react-native';

interface InfoRowProps {
  label: string;
  value: string;
  /** Hide the bottom divider on the last row of a group. */
  last?: boolean;
}

/** Label/value row used in detail views (Personal Details, Payslip breakdown). */
export function InfoRow({ label, value, last = false }: InfoRowProps) {
  return (
    <View
      className={`flex-row items-start justify-between py-3 ${
        last ? '' : 'border-b border-surface-border'
      }`}>
      <Text className="mr-4 flex-1 text-sm text-ink-muted">{label}</Text>
      <Text className="flex-[1.4] text-right text-sm font-medium text-ink">
        {value}
      </Text>
    </View>
  );
}
