/**
 * Shared axios instance — the mobile counterpart of the web app's
 * `framework/rest/utils/request.ts`.
 *
 * Differences from the web version:
 *  - Token comes from AsyncStorage (via the in-memory cache in token.ts),
 *    not cookies/localStorage. The request interceptor is async so it can
 *    fall back to hydrating from storage if the cache is cold.
 *  - No payload/param encryption toggle (the web app's encryption layer is
 *    out of scope for the initial mobile port); it can be added here later
 *    without touching any query hook or screen.
 *  - The 401 handler clears the token and delegates redirect to the app's
 *    auth state (RootNavigator swaps to the Auth flow) instead of a hard
 *    `window.location` redirect.
 */
import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { API_BASE_URL, API_TIMEOUT } from './env';
import { SKIP_AUTH_PATHS } from './endpoints';
import { clearToken, getToken, hydrateToken } from './token';

/** Optional hook the auth layer registers to react to a 401 (force sign-out). */
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

export const http: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach the bearer token except on public auth paths.
http.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const url = config.url ?? '';
    const shouldSkipAuth = SKIP_AUTH_PATHS.some(path => url.includes(path));

    if (!shouldSkipAuth) {
      // Prefer the in-memory cache; hydrate from storage if it's cold.
      const token = getToken() ?? (await hydrateToken());
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return config;
  },
  error => Promise.reject(error),
);

// Response interceptor: on 401, clear the session and let the app react.
http.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await clearToken();
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);
