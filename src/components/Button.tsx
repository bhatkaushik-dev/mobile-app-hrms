import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  /** Optional trailing element, e.g. an arrow glyph. */
  trailing?: React.ReactNode;
  className?: string;
}

const containerByVariant: Record<Variant, string> = {
  primary: 'bg-brand-600 active:bg-brand-700',
  secondary: 'bg-surface-muted border border-surface-border active:bg-gray-200',
  ghost: 'bg-transparent',
};

const labelByVariant: Record<Variant, string> = {
  primary: 'text-white',
  secondary: 'text-ink',
  ghost: 'text-brand-600',
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  trailing,
  className = '',
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      className={`h-13 min-h-[52px] flex-row items-center justify-center rounded-xl px-5 ${containerByVariant[variant]} ${isDisabled ? 'opacity-50' : ''} ${className}`}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.white : colors.brand} />
      ) : (
        <View className="flex-row items-center">
          <Text
            numberOfLines={1}
            className={`text-center text-base font-semibold ${labelByVariant[variant]}`}>
            {label}
          </Text>
          {trailing ? <View className="ml-2">{trailing}</View> : null}
        </View>
      )}
    </Pressable>
  );
}
