/**
 * AuthContext — single source of truth for the signed-in session.
 *
 * Persists the session to AsyncStorage when "Remember Me" is checked, so the
 * user stays logged in across app restarts. The RootNavigator reads `status`
 * to decide whether to show the Auth flow or the App flow.
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
import { authService } from '../api/services';
import type { AuthSession, User } from '../types';

const SESSION_KEY = '@technova/session';

type AuthStatus = 'loading' | 'signedIn' | 'signedOut';

interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  signIn: (userId: string, password: string, remember: boolean) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [session, setSession] = useState<AuthSession | null>(null);

  // Restore a remembered session on cold start.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(SESSION_KEY);
        if (raw) {
          setSession(JSON.parse(raw) as AuthSession);
          setStatus('signedIn');
          return;
        }
      } catch {
        // ignore corrupt storage and fall through to signed-out
      }
      setStatus('signedOut');
    })();
  }, []);

  const signIn = useCallback(
    async (userId: string, password: string, remember: boolean) => {
      const result = await authService.signIn(userId, password);
      setSession(result);
      setStatus('signedIn');
      if (remember) {
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(result));
      }
    },
    [],
  );

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setSession(null);
    setStatus('signedOut');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ status, user: session?.user ?? null, signIn, signOut }),
    [status, session, signIn, signOut],
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
