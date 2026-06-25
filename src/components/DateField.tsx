import React, { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { colors } from '../theme/colors';

interface DateFieldProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  /** Days before this date are disabled (e.g. a "To" date can't precede "From"). */
  minDate?: Date | null;
  containerClassName?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** dd/MM/yyyy for display. */
export const formatDMY = (d: Date) =>
  `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

/** yyyy-MM-dd — the format react-native-calendars uses. */
const toISO = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const fromISO = (s: string) => {
  const [y, m, day] = s.split('-').map(Number);
  return new Date(y, m - 1, day);
};

/**
 * Single-date picker using the react-native-calendars month view inside a modal.
 * Pure JS (no native picker dependency to rebuild).
 */
export function DateField({
  label,
  value,
  onChange,
  placeholder = 'Select date',
  required = false,
  error,
  minDate,
  containerClassName = '',
}: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const selectedISO = value ? toISO(value) : undefined;

  return (
    <View className={containerClassName}>
      <Text className="mb-2 text-sm font-semibold text-ink">
        {label}
        {required ? <Text className="text-danger"> *</Text> : null}
      </Text>

      <Pressable
        accessibilityRole="button"
        onPress={() => setOpen(true)}
        className={`h-13 min-h-[52px] flex-row items-center rounded-xl border px-4 ${
          error ? 'border-danger' : 'border-surface-border'
        } bg-white`}>
        <Text className="mr-2 text-base text-ink-muted">📅</Text>
        <Text
          className={`flex-1 text-base ${value ? 'text-ink' : 'text-ink-faint'}`}
          numberOfLines={1}>
          {value ? formatDMY(value) : placeholder}
        </Text>
      </Pressable>

      {error && error.trim() ? (
        <Text className="mt-1.5 text-sm text-danger">{error}</Text>
      ) : null}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}>
        <Pressable
          className="flex-1 items-center justify-center bg-black/40 px-6"
          onPress={() => setOpen(false)}>
          <Pressable className="w-full overflow-hidden rounded-2xl bg-white p-2">
            <Calendar
              current={selectedISO}
              minDate={minDate ? toISO(minDate) : undefined}
              onDayPress={day => {
                onChange(fromISO(day.dateString));
                setOpen(false);
              }}
              markedDates={
                selectedISO
                  ? {
                      [selectedISO]: {
                        selected: true,
                        selectedColor: colors.brand,
                      },
                    }
                  : undefined
              }
              enableSwipeMonths
              theme={{
                todayTextColor: colors.brand,
                arrowColor: colors.brand,
                textMonthFontWeight: '700',
                textDayFontSize: 15,
                textMonthFontSize: 16,
                monthTextColor: colors.ink,
                dayTextColor: colors.ink,
                textDisabledColor: colors.inkFaint,
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
