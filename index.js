/**
 * @format
 */

// Polyfill global.crypto.getRandomValues so crypto-js (used for AES password
// encryption) can source a secure PRNG on React Native. MUST be imported
// before any module that touches crypto-js.
import 'react-native-get-random-values';

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
