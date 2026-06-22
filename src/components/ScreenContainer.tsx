import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenContainerProps {
  children: React.ReactNode;
  /** Wrap content in a ScrollView (default true). Set false for fixed layouts. */
  scroll?: boolean;
  className?: string;
}

/**
 * Standard screen shell: muted background + bottom safe-area padding.
 * Header/top inset is owned by the navigator, so we only pad the bottom here.
 */
export function ScreenContainer({
  children,
  scroll = true,
  className = '',
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = { paddingBottom: insets.bottom + 24 };

  if (scroll) {
    return (
      <ScrollView
        className="flex-1 bg-surface-muted"
        contentContainerStyle={bottomPad}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className={`px-4 pt-4 ${className}`}>{children}</View>
      </ScrollView>
    );
  }

  return (
    <View className="flex-1 bg-surface-muted" style={bottomPad}>
      <View className={`flex-1 px-4 pt-4 ${className}`}>{children}</View>
    </View>
  );
}
