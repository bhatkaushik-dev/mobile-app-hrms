import React from 'react';
import { Text, View } from 'react-native';

interface SectionHeaderProps {
  title: string;
  action?: React.ReactNode;
  className?: string;
}

/** Title row above a group of cards, with an optional trailing action. */
export function SectionHeader({ title, action, className = '' }: SectionHeaderProps) {
  return (
    <View className={`mb-3 flex-row items-center justify-between ${className}`}>
      <Text className="text-xs font-bold uppercase tracking-wider text-ink-muted">
        {title}
      </Text>
      {action}
    </View>
  );
}
