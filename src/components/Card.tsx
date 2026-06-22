import React from 'react';
import { Pressable, View } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
}

/** White rounded surface with a soft border. Becomes pressable if `onPress` is set. */
export function Card({ children, onPress, className = '' }: CardProps) {
  const base = `rounded-2xl border border-surface-border bg-white p-4 ${className}`;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={`${base} active:bg-surface-muted`}
        accessibilityRole="button">
        {children}
      </Pressable>
    );
  }

  return <View className={base}>{children}</View>;
}
