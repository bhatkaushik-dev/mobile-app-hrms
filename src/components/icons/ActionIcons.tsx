import React from 'react';
import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';

/**
 * Line-style action icons (Lucide-flavoured) used by the Approvals action
 * column. Each takes a `size` and `color`; stroke width scales with size so
 * they stay crisp inside the small icon buttons.
 */
export interface IconProps {
  size?: number;
  color?: string;
}

const sw = (size: number) => Math.max(1.5, size / 12);

/** History — clock with a counter-clockwise arrow. */
export function HistoryIcon({ size = 20, color = '#1A1A2E' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
        stroke={color}
        strokeWidth={sw(size)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 3v5h5"
        stroke={color}
        strokeWidth={sw(size)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 7v5l3 2"
        stroke={color}
        strokeWidth={sw(size)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Reject — filled circle with a white cross. */
export function RejectIcon({ size = 20, color = '#DC2626' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill={color} />
      <Line x1="8.5" y1="8.5" x2="15.5" y2="15.5" stroke="#fff" strokeWidth={sw(size) + 0.3} strokeLinecap="round" />
      <Line x1="15.5" y1="8.5" x2="8.5" y2="15.5" stroke="#fff" strokeWidth={sw(size) + 0.3} strokeLinecap="round" />
    </Svg>
  );
}

/** Approve — circle outline with a check. */
export function ApproveIcon({ size = 20, color = '#16A34A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={sw(size)} />
      <Polyline
        points="7.5 12.5 10.5 15.5 16.5 8.5"
        stroke={color}
        strokeWidth={sw(size)}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

/** Refer Back — clipboard with a small clock. */
export function ReferBackIcon({ size = 20, color = '#D97706' }: IconProps) {
  const w = sw(size);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 4H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h6"
        stroke={color}
        strokeWidth={w}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 4h2a2 2 0 0 1 2 2v3"
        stroke={color}
        strokeWidth={w}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Rect x="8" y="2" width="8" height="4" rx="1" stroke={color} strokeWidth={w} />
      <Circle cx="16.5" cy="16.5" r="4.5" stroke={color} strokeWidth={w} />
      <Path d="M16.5 14.5v2l1.3 1" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** View — eye outline with pupil. */
export function ViewIcon({ size = 20, color = '#2563EB' }: IconProps) {
  const w = sw(size);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
        stroke={color}
        strokeWidth={w}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={w} />
    </Svg>
  );
}
