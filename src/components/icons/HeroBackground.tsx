import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, {
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

/**
 * Decorative sign-in hero background, ported from the provided Figma export.
 *
 * The coral base is reproduced exactly with a horizontal linear gradient. The
 * four corner colour blobs — originally heavily blurred ellipses — are rendered
 * as radial gradients, which is the reliable, performant equivalent on RN
 * (large `feGaussianBlur` and `mix-blend-mode` are not well supported by
 * react-native-svg). Sized to the source 1920×1163 viewBox and `slice`-fitted
 * so it covers the hero regardless of the band's height.
 */
export function HeroBackground() {
  return (
    <Svg
      style={StyleSheet.absoluteFill}
      width="100%"
      height="100%"
      viewBox="0 0 1920 1163"
      preserveAspectRatio="xMidYMin slice">
      <Defs>
        <LinearGradient
          id="heroBase"
          x1="0"
          y1="581"
          x2="1920"
          y2="581"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B12A5B" />
          <Stop offset="0.357" stopColor="#CF556C" />
          <Stop offset="0.73" stopColor="#F99185" />
          <Stop offset="0.79" stopColor="#FF8C7F" />
          <Stop offset="1" stopColor="#FA6559" />
        </LinearGradient>
        <RadialGradient id="glowBlue" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#377DFF" stopOpacity="1" />
          <Stop offset="1" stopColor="#377DFF" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="glowYellow" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#FEB52A" stopOpacity="1" />
          <Stop offset="1" stopColor="#FEB52A" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="glowOrange" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#FF6340" stopOpacity="1" />
          <Stop offset="1" stopColor="#FF6340" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="glowGreen" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#38CB89" stopOpacity="1" />
          <Stop offset="1" stopColor="#38CB89" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* Coral base */}
      <Rect width="1920" height="1163" fill="url(#heroBase)" />

      {/* Decorative swoosh (approximates the source's subtle overlay stroke).
          `fill="none"` is required — react-native-svg fills paths black by default. */}
      <Path
        d="M709.829 83.3239C837.377 486.583 1245.04 647.558 1380.93 490.323C1516.82 333.087 1273.23 142.379 1032.09 211.351C790.951 280.322 622.13 413.144 526.069 692.935"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.1"
        strokeWidth="72.8495"
      />

      {/* Soft corner glows (blurred blobs in the source) */}
      <Ellipse cx="223" cy="200" rx="760" ry="760" fill="url(#glowBlue)" opacity="0.18" />
      <Ellipse cx="1747" cy="199" rx="690" ry="690" fill="url(#glowYellow)" opacity="0.18" />
      <Ellipse cx="302" cy="1201" rx="370" ry="370" fill="url(#glowOrange)" opacity="0.2" />
      <Ellipse cx="1772" cy="1262" rx="390" ry="390" fill="url(#glowGreen)" opacity="0.2" />
    </Svg>
  );
}
