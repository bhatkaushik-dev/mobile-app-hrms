import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

type GradientDirection = 'vertical' | 'horizontal' | 'diagonal';

interface GradientFillProps {
  /** Two or more color stops, drawn evenly across the given direction. */
  colors: readonly string[];
  /** Gradient axis. Defaults to top→bottom. */
  direction?: GradientDirection;
  /**
   * Unique gradient id. Every mounted instance MUST pass a distinct value —
   * react-native-svg registers `<Defs>` ids globally, so duplicates collide.
   */
  id: string;
}

const AXES: Record<GradientDirection, Record<'x1' | 'y1' | 'x2' | 'y2', string>> = {
  vertical: { x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
  horizontal: { x1: '0%', y1: '0%', x2: '100%', y2: '0%' },
  diagonal: { x1: '0%', y1: '0%', x2: '100%', y2: '100%' },
};

/**
 * Fills its parent with a linear gradient. Place inside an `overflow-hidden`
 * View (rounded corners clip it correctly) and layer content above it.
 * The project has no gradient library, so this draws through react-native-svg —
 * the same approach as {@link HeroBackground}.
 */
export function GradientFill({ colors, direction = 'vertical', id }: GradientFillProps) {
  const axis = AXES[direction];
  const last = Math.max(colors.length - 1, 1);
  return (
    <Svg
      style={StyleSheet.absoluteFill}
      width="100%"
      height="100%"
      preserveAspectRatio="none">
      <Defs>
        <LinearGradient id={id} {...axis}>
          {colors.map((color, i) => (
            <Stop key={`${id}-${i}`} offset={`${(i / last) * 100}%`} stopColor={color} />
          ))}
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}
