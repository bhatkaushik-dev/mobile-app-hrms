/**
 * Central endpoint map — the mobile counterpart of the web app's
 * `framework/rest/utils/endpoints.ts`. Only the endpoints the mobile app
 * actually calls are listed; add more as modules are ported.
 *
 * Paths are relative to `API_BASE_URL` (see env.ts).
 */
export const API_ENDPOINTS = {
  AUTH: {
    TOKEN: '/authenticate',
    REFRESH_TOKEN: '/refresh',
    USER_INFO: '/landingPageInfo',
    LOGOUT: '/logOut',
    MENU_ITEMS: '/getMenuData',
  },
  COMMON: {
    USER_PREFERENCE: '/hcmcommon/getUserPreference',
  },
} as const;

/**
 * Paths that must NOT carry an Authorization header (public endpoints hit
 * before a token exists). Kept in sync with the web request interceptor.
 */
export const SKIP_AUTH_PATHS: string[] = [
  API_ENDPOINTS.AUTH.TOKEN,
  '/generateOTP',
  '/getPasswordPolicy',
  '/validateOTP',
  '/restPasswordInForgotPwd',
];
