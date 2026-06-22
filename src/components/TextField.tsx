import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { colors } from '../theme/colors';

interface TextFieldProps extends Omit<TextInputProps, 'className'> {
  label: string;
  error?: string;
  /** Renders a show/hide toggle and masks input by default. */
  secure?: boolean;
  containerClassName?: string;
}

export function TextField({
  label,
  error,
  secure = false,
  containerClassName = '',
  ...inputProps
}: TextFieldProps) {
  const [hidden, setHidden] = useState(secure);
  const [focused, setFocused] = useState(false);

  return (
    <View className={containerClassName}>
      <Text className="mb-2 text-sm font-semibold text-ink">{label}</Text>
      <View
        className={`h-13 min-h-[52px] flex-row items-center rounded-xl border bg-white px-4 ${
          error
            ? 'border-danger'
            : focused
            ? 'border-brand-600'
            : 'border-surface-border'
        }`}>
        <TextInput
          className="flex-1 p-0 text-base text-ink"
          placeholderTextColor={colors.inkFaint}
          secureTextEntry={hidden}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...inputProps}
        />
        {secure ? (
          <Pressable
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            onPress={() => setHidden(h => !h)}>
            <Text className="text-lg text-ink-muted">{hidden ? '🙈' : '👁️'}</Text>
          </Pressable>
        ) : null}
      </View>
      {error ? <Text className="mt-1.5 text-sm text-danger">{error}</Text> : null}
    </View>
  );
}
