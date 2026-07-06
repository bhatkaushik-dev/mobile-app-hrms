/**
 * Auth React Query hooks — the mobile counterpart of the web app's
 * `menu/auth.query.ts`.
 *
 * Two low-level mutations map 1:1 to backend calls (`useTokenMutation`,
 * `useUserInfoMutation`), and `useSignIn` composes them into the full sign-in
 * sequence the web app runs inside its form's `onSubmit`:
 *   1. POST /authenticate  → access token
 *   2. persist token       → so the interceptor authorizes the next call
 *   3. GET /landingPageInfo → user profile
 *   4. establish + persist the session (AuthContext)
 *
 * Screens use `useSignIn`; the two primitives are exported for reuse (e.g. a
 * future token refresh flow).
 */
import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { AxiosError } from 'axios';
import { CoreApi } from '../core/core-api';
import { API_ENDPOINTS } from '../core/endpoints';
import { ENCRYPT_PASSWORD } from '../core/env';
import { buildUserLogObj } from '../core/deviceInfo';
import { encryptPassword } from '../core/aes';
import { clearToken, setToken } from '../core/token';
import { useAuth } from '../../context/AuthContext';
import type { AuthSession, User } from '../../types';
import type { TokenResponse, UserInfo, UserInfoResponse } from './auth.types';

const authApi = new CoreApi();

/** Step 1 — exchange credentials for an access token. */
export function useTokenMutation() {
  return useMutation({
    mutationFn: async (vars: { username: string; password: string }) => {
      const payload = {
        userLogObj: buildUserLogObj(),
        username: vars.username.trim(),
        // The current backend expects a plaintext password; encryption is
        // toggled by ENCRYPT_PASSWORD (see env.ts) to match the web's AesUtil
        // if the server re-enables server-side decryption.
        password: ENCRYPT_PASSWORD
          ? encryptPassword(vars.password)
          : vars.password,
      };
      const res = await authApi.findAllPost<TokenResponse>(
        API_ENDPOINTS.AUTH.TOKEN,
        payload,
      );
      return res.data;
    },
  });
}

/** Step 3 — fetch the signed-in user's profile (requires a stored token). */
export function useUserInfoMutation() {
  return useMutation({
    mutationFn: async () => {
      const res = await authApi.findAllGet<UserInfoResponse>(
        API_ENDPOINTS.AUTH.USER_INFO,
      );
      return res.data;
    },
  });
}

/** Map the backend user object onto the app's `User` shape, defensively. */
function toUser(info: UserInfo): User {
  return {
    id: String(info.userKey ?? info.userId ?? info.employeeKey ?? ''),
    userId: String(info.userId ?? ''),
    name: String(info.userName ?? info.employeeName ?? info.userId ?? ''),
    email: String(info.emailId ?? info.email ?? ''),
    designation: String(info.designation ?? ''),
    department: String(info.department ?? ''),
    avatarUrl: info.avatarUrl,
  };
}

/** Pull the clearest message out of an axios/network/generic error. */
function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as any;
    if (data?.errDesc) return data.errDesc;
    if (error.code === 'ECONNABORTED') return 'Request timeout. Please try again.';
    if (!error.response) {
      return 'Network error. Please check your connection and try again.';
    }
  }
  if (error instanceof Error && error.message) return error.message;
  return 'An error occurred during authentication.';
}

/**
 * Composite sign-in flow. Returns an async `signIn` plus a combined loading
 * flag and the last error message, so the screen stays declarative.
 */
export function useSignIn() {
  const { establishSession } = useAuth();
  const tokenMutation = useTokenMutation();
  const userInfoMutation = useUserInfoMutation();
  const [error, setError] = useState<string | null>(null);

  const signIn = useCallback(
    async (userId: string, password: string, remember: boolean) => {
      setError(null);
      try {
        // Step 1 + 2: get the token, then persist it for the next request.
        const tokenData = await tokenMutation.mutateAsync({
          username: userId,
          password,
        });
        const accessToken = tokenData?.accessToken;
        if (!accessToken) {
          throw new Error('Authentication failed — invalid credentials.');
        }
        await setToken(accessToken);

        // Step 3: fetch the user profile (interceptor now attaches the token).
        const infoBody = await userInfoMutation.mutateAsync();
        const userInfo = infoBody?.data;
        if (!userInfo) {
          throw new Error('Failed to fetch user information. Please try again.');
        }

        // Step 4: establish + (optionally) persist the session.
        const expiryDuration = Number(tokenData.expiryDuration) || 0;
        const session: AuthSession = {
          token: accessToken,
          user: toUser(userInfo),
          expiresAt: expiryDuration > 0 ? Date.now() + expiryDuration : undefined,
          raw: userInfo,
        };
        await establishSession(session, remember);
      } catch (err) {
        // Roll back any partial auth state so a failed attempt leaves nothing behind.
        await clearToken();
        const message = extractErrorMessage(err);
        setError(message);
        throw err;
      }
    },
    [tokenMutation, userInfoMutation, establishSession],
  );

  return {
    signIn,
    error,
    isLoading: tokenMutation.isPending || userInfoMutation.isPending,
  };
}
