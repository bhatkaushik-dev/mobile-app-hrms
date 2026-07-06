/**
 * AuthContext — single source of truth for the signed-in session.
 *
 * Owns session state + persistence only; the network sign-in sequence lives in
 * the `useSignIn` React Query hook (src/api/auth), which calls
 * `establishSession` on success. Persists the session to AsyncStorage when
 * "Remember Me" is checked so the user stays logged in across restarts. The
 * RootNavigator reads `status` to decide Auth flow vs. App flow.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { setUnauthorizedHandler } from '../api/core/http';
import { clearToken, hydrateToken, setToken } from '../api/core/token';
import { queryClient } from '../api/core/queryClient';
import type { AuthSession, User } from '../types';

const SESSION_KEY = '@technova/session';

type AuthStatus = 'loading' | 'signedIn' | 'signedOut';

interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  /** Called by the sign-in flow once token + profile are fetched. */
  establishSession: (session: AuthSession, remember: boolean) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [session, setSession] = useState<AuthSession | null>(null);

  const signOut = useCallback(async () => {
    await Promise.all([AsyncStorage.removeItem(SESSION_KEY), clearToken()]);
    queryClient.clear();
    setSession(null);
    setStatus('signedOut');
  }, []);

  // Restore a remembered session on cold start.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(SESSION_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as AuthSession;
          // Honor token expiry if we stored one.
          if (!saved.expiresAt || saved.expiresAt > Date.now()) {
            await hydrateToken();
            setSession(saved);
            setStatus('signedIn');
            return;
          }
          // Expired — clean up and fall through to signed-out.
          await Promise.all([AsyncStorage.removeItem(SESSION_KEY), clearToken()]);
        }
      } catch {
        // ignore corrupt storage and fall through to signed-out
      }
      setStatus('signedOut');
    })();
  }, []);

  // A 401 from any request forces a sign-out.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      signOut().catch(() => {});
    });
    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  const establishSession = useCallback(
    async (next: AuthSession, remember: boolean) => {
      await setToken(next.token);
      setSession(next);
      setStatus('signedIn');
      if (remember) {
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(next));
      } else {
        await AsyncStorage.removeItem(SESSION_KEY);
      }
    },
    [],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ status, user: session?.user ?? null, establishSession, signOut }),
    [status, session, establishSession, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
