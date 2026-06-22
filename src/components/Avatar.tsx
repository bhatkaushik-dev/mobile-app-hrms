import React from 'react';
import { Text, View } from 'react-native';

interface AvatarProps {
  name: string;
  size?: number;
}

/** Circular avatar showing the user's initials over the brand color. */
export function Avatar({ name, size = 44 }: AvatarProps) {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View
      className="items-center justify-center rounded-full bg-brand-600"
      style={{ width: size, height: size }}>
      <Text className="font-bold text-white" style={{ fontSize: size * 0.38 }}>
        {initials}
      </Text>
    </View>
  );
}
