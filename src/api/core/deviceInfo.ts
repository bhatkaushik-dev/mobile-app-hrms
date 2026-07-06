/**
 * Device metadata for the login audit payload (`userLogObj`).
 *
 * The web app collects browser/OS/screen info via a hook; on mobile we derive
 * the equivalent from React Native's `Platform` and `Dimensions`. Geolocation
 * is intentionally left blank to avoid a runtime permission prompt on the
 * sign-in screen — wire it in later if the backend needs coordinates.
 */
import { Dimensions, Platform } from 'react-native';

export interface UserLogObj {
  browserName: string;
  browserVersion: string;
  ulDeviceOS: string;
  ulDeviceName: string;
  ulLoginScreenSize: string;
  ulLoginCoordinates: string;
}

export function buildUserLogObj(): UserLogObj {
  const { width, height } = Dimensions.get('window');
  return {
    // No browser on native; report the app runtime instead so the field is populated.
    browserName: 'ReactNativeApp',
    browserVersion: String(Platform.Version ?? 'Unknown'),
    ulDeviceOS: Platform.OS,
    ulDeviceName: Platform.OS === 'ios' ? 'iOS Device' : 'Android Device',
    ulLoginScreenSize: JSON.stringify({ width, height }),
    ulLoginCoordinates: JSON.stringify({ lat: '', lng: '' }),
  };
}
