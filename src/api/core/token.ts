/**
 * Auth-token storage.
 *
 * The web app keeps the token in a cookie + localStorage and reads it
 * synchronously inside the axios interceptor. React Native has no synchronous
 * storage, so we cache the token in memory (for the sync-ish interceptor path)
 * and back it with AsyncStorage for persistence across restarts.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@technova/auth_token';

let inMemoryToken: string | null = null;

/** Persist the token and prime the in-memory cache. */
export async function setToken(token: string): Promise<void> {
  inMemoryToken = token;
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

/** Synchronous read of the cached token (used by the request interceptor). */
export function getToken(): string | null {
  return inMemoryToken;
}

/** Load the persisted token into memory on cold start. Returns it if present. */
export async function hydrateToken(): Promise<string | null> {
  inMemoryToken = await AsyncStorage.getItem(TOKEN_KEY);
  return inMemoryToken;
}

/** Clear the token from memory and storage (sign-out / 401). */
export async function clearToken(): Promise<void> {
  inMemoryToken = null;
  await AsyncStorage.removeItem(TOKEN_KEY);
}
