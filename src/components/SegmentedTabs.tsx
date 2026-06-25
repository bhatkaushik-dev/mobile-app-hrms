import React from 'react';
import { Pressable, ScrollView, Text } from 'react-native';

export interface SegmentedTabItem {
  key: string;
  label: string;
}

interface SegmentedTabsProps {
  items: SegmentedTabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

/**
 * Horizontal scrollable pill tab bar. Mirrors the web profile sidebar as a
 * mobile-friendly segmented control; scrolls when the labels overflow.
 */
export function SegmentedTabs({
  items,
  activeKey,
  onChange,
  className = '',
}: SegmentedTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={className}
      contentContainerClassName="gap-2">
      {items.map(item => {
        const active = item.key === activeKey;
        return (
          <Pressable
            key={item.key}
            onPress={() => onChange(item.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            className={`rounded-full px-4 py-2 ${
              active
                ? 'bg-brand-600'
                : 'border border-surface-border bg-white active:bg-surface-muted'
            }`}>
            <Text
              className={`text-sm font-semibold ${
                active ? 'text-white' : 'text-ink-muted'
              }`}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
