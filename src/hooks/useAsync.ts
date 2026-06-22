import { useCallback, useEffect, useState } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Runs an async loader on mount and exposes loading/error/data plus a reload().
 * Keeps every data screen free of repetitive useState/useEffect boilerplate.
 */
export function useAsync<T>(loader: () => Promise<T>): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(() => {
    let active = true;
    setLoading(true);
    setError(null);
    loader()
      .then(result => {
        if (active) setData(result);
      })
      .catch((e: unknown) => {
        if (active) setError(e instanceof Error ? e.message : 'Something went wrong.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(run, [run]);

  return { data, loading, error, reload: run };
}
