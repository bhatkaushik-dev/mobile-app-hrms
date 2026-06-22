/**
 * Raw color tokens.
 *
 * NativeWind `className` is the primary styling mechanism (see tailwind.config.js).
 * These constants exist for the few places className cannot reach — native props
 * such as StatusBar barStyle, gradient color stops, or icon `color` props.
 */
export const colors = {
  brand: '#2563EB',
  brandDark: '#1D4ED8',
  accent: '#38BDF8',
  ink: '#1A1A2E',
  inkMuted: '#6B7280',
  inkFaint: '#9CA3AF',
  white: '#FFFFFF',
  surfaceMuted: '#F5F6F8',
  border: '#E5E7EB',
  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
  info: '#2563EB',
} as const;

/** Color stops for the sign-in hero gradient (deep → bright blue). */
export const heroGradient = ['#1D4ED8', '#2563EB', '#3B82F6'] as const;

export type ColorToken = keyof typeof colors;
