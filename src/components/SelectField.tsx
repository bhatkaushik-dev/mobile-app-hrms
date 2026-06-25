import React, { useState } from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label: string;
  /** Selected option value, or '' when nothing is chosen. */
  value: string;
  options: SelectOption[];
  onSelect: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  containerClassName?: string;
}

/** Tap-to-open dropdown backed by a bottom-sheet modal. Pure JS, no native deps. */
export function SelectField({
  label,
  value,
  options,
  onSelect,
  placeholder = 'Select',
  required = false,
  disabled = false,
  error,
  containerClassName = '',
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <View className={containerClassName}>
      <Text className="mb-2 text-sm font-semibold text-ink">
        {label}
        {required ? <Text className="text-danger"> *</Text> : null}
      </Text>

      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={() => setOpen(true)}
        className={`h-13 min-h-[52px] flex-row items-center justify-between rounded-xl border px-4 ${
          disabled
            ? 'border-surface-border bg-surface-muted'
            : error
            ? 'border-danger bg-white'
            : 'border-surface-border bg-white'
        }`}>
        <Text
          className={`flex-1 text-base ${
            selected ? 'text-ink' : 'text-ink-faint'
          }`}
          numberOfLines={1}>
          {selected ? selected.label : placeholder}
        </Text>
        <Text className="ml-2 text-ink-muted">▾</Text>
      </Pressable>

      {error ? <Text className="mt-1.5 text-sm text-danger">{error}</Text> : null}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}>
        <Pressable
          className="flex-1 items-center justify-center bg-black/40 px-6"
          onPress={() => setOpen(false)}>
          <Pressable className="max-h-[70%] w-full overflow-hidden rounded-2xl bg-white">
            <Text className="border-b border-surface-border px-5 py-3.5 text-sm font-bold uppercase tracking-wider text-ink-muted">
              {label}
            </Text>
            <FlatList
              data={options}
              keyExtractor={o => o.value}
              bounces={false}
              ListEmptyComponent={
                <Text className="px-5 py-4 text-base text-ink-faint">
                  No options available.
                </Text>
              }
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <Pressable
                    onPress={() => {
                      onSelect(item.value);
                      setOpen(false);
                    }}
                    className="flex-row items-center justify-between border-b border-surface-border px-5 py-3.5 active:bg-surface-muted">
                    <Text
                      className={`flex-1 text-base ${
                        isSelected ? 'font-semibold text-brand-600' : 'text-ink'
                      }`}>
                      {item.label}
                    </Text>
                    {isSelected ? (
                      <Text className="ml-2 text-brand-600">✓</Text>
                    ) : null}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
