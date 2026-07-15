import { useState, useEffect } from 'react';

const DATA_URL = `${import.meta.env.BASE_URL}data/latest.json`;

/**
 * Fetches the latest FX rate snapshot from data/latest.json.
 * @returns {{ data: object|null, loading: boolean, error: string|null, lastUpdated: Date|null }}
 */
export function useLatestRates() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchRates() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${DATA_URL}?_=${Date.now()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          setData(json);
          setLastUpdated(json.updated ? new Date(json.updated) : null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchRates();
    return () => { cancelled = true; };
  }, []);

  return { data, loading, error, lastUpdated };
}
