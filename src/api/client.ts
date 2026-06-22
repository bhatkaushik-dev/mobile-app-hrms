/**
 * Tiny API client abstraction.
 *
 * Right now it just simulates latency and resolves with in-memory mock data.
 * When a real backend is ready, replace `mockRequest` with a fetch/axios call —
 * the service modules and screens won't need to change because they only depend
 * on the Promise-returning service functions, not on how data is fetched.
 */

const DEFAULT_DELAY = 600;

/** Resolve with `data` after a simulated network delay. */
export function mockRequest<T>(data: T, delay: number = DEFAULT_DELAY): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
}

/** Reject after a simulated network delay (used to demo error states). */
export function mockReject<T = never>(
  message: string,
  delay: number = DEFAULT_DELAY,
): Promise<T> {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error(message)), delay),
  );
}

/*
 * --- Real backend wiring (for later) ---------------------------------------
 *
 * export const BASE_URL = 'https://api.technova.example';
 *
 * export async function request<T>(path: string, init?: RequestInit): Promise<T> {
 *   const res = await fetch(`${BASE_URL}${path}`, {
 *     headers: { 'Content-Type': 'application/json', ...init?.headers },
 *     ...init,
 *   });
 *   if (!res.ok) throw new Error(`Request failed: ${res.status}`);
 *   return res.json() as Promise<T>;
 * }
 */
