/**
 * API environment configuration.
 *
 * The web app resolves the base URL from `NEXT_PUBLIC_*` env vars at build time
 * and picks public vs. private by hostname. A mobile app has no hostname to
 * inspect, so we expose the two known environments explicitly and select one
 * with a single switch. Point `API_ENV` at whichever the current build targets.
 *
 * Base URL shape mirrors the web:  <host>/<endpoint-prefix>
 *   e.g. http://82.178.142.38:8080/OteErpAdv
 */

type ApiEnv = 'production' | 'development';

/** Flip this (or wire it to a build flag) to target the dev backend. */
export const API_ENV: ApiEnv = 'production';

/**
 * Whether to AES-encrypt the login password before sending it to
 * `/authenticate` (matches the web app's `AesUtil`).
 *
 * The current backend (82.178.142.38:8080) does NOT decrypt this field — it
 * compares the received value directly, so it expects PLAINTEXT. An encrypted
 * blob is rejected with `TZE-11 Invalid username or password`, verified against
 * the live server. Leave this `false` unless the backend re-enables server-side
 * password decryption, then flip it to `true` to restore the web's behavior.
 */
export const ENCRYPT_PASSWORD = false;

const HOSTS: Record<ApiEnv, string> = {
  production: 'http://82.178.142.38:8080',
  development: 'http://82.178.142.38:9090',
};

/** Path prefix all endpoints hang off of (equivalent to NEXT_PUBLIC_API_BASE_URL_ENDPOINT). */
const API_PREFIX = 'OteErpAdv';

export const API_BASE_URL = `${HOSTS[API_ENV]}/${API_PREFIX}`;

/** Request timeout in ms. */
export const API_TIMEOUT = 60_000;
