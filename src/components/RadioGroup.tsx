import React from 'react';
import { Pressable, Text, View } from 'react-native';

export interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  label?: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  /** Lay options out in a row (default) or stacked. */
  direction?: 'row' | 'column';
  className?: string;
}

/** Single-select radio control. Used for things like Full Day / Half Day. */
export function RadioGroup({
  label,
  options,
  value,
  onChange,
  direction = 'row',
  className = '',
}: RadioGroupProps) {
  return (
    <View className={className}>
      {label ? (
        <Text className="mb-2 text-sm font-semibold text-ink">{label}</Text>
      ) : null}
      <View className={direction === 'row' ? 'flex-row flex-wrap' : ''}>
        {options.map(opt => {
          const selected = opt.value === value;
          return (
            <Pressable
              key={opt.value}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => onChange(opt.value)}
              className={`mr-6 flex-row items-center py-1 ${
                direction === 'column' ? 'mb-1' : ''
              }`}>
              <View
                className={`items-center justify-center rounded-full border-2 ${
                  selected ? 'border-brand-600' : 'border-surface-border'
                }`}
                style={{ height: 20, width: 20, borderRadius: 10 }}>
                {selected ? (
                  <View
                    className="bg-brand-600"
                    style={{ height: 10, width: 10, borderRadius: 5 }}
                  />
                ) : null}
              </View>
              <Text className="ml-2 text-sm text-ink">{opt.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
