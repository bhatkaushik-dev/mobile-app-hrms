import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export interface SegmentedTabItem {
  key: string;
  label: string;
  /** Optional count rendered as a badge beside the label (e.g. approval tabs). */
  count?: number;
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
            className={`flex-row items-center rounded-full px-4 py-2 ${
              active
                ? 'bg-brand-600'
                : 'border border-surface-border bg-white active:bg-surface-muted'
            }`}>
            <Text
              numberOfLines={1}
              className={`text-sm font-semibold ${
                active ? 'text-white' : 'text-ink-muted'
              }`}>
              {item.label}
            </Text>
            {typeof item.count === 'number' ? (
              <View
                className={`ml-2 min-w-[20px] items-center justify-center rounded-full px-1.5 py-0.5 ${
                  active ? 'bg-white/25' : 'bg-brand-50'
                }`}>
                <Text
                  className={`text-xs font-bold ${
                    active ? 'text-white' : 'text-brand-600'
                  }`}>
                  {item.count}
                </Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
