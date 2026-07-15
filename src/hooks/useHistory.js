import { useState, useCallback, useRef } from 'react';

const HISTORY_BASE = `${import.meta.env.BASE_URL}data/history`;
const MAX_DAYS = 90;

function datesBetween(startDate, endDate) {
  const dates = [];
  const start = new Date(startDate + 'T00:00:00Z');
  const end = new Date(endDate + 'T00:00:00Z');
  // Cap to MAX_DAYS
  const maxStart = new Date(end);
  maxStart.setUTCDate(maxStart.getUTCDate() - MAX_DAYS);
  const clamped = start < maxStart ? maxStart : start;

  const cur = new Date(clamped);
  while (cur <= end) {
    dates.push(cur.toISOString().slice(0, 10));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return dates;
}

/**
 * Lazily fetches history JSON files for a date range.
 * Call `fetchHistory()` to trigger the load.
 *
 * @param {{ startDate: string, endDate: string }} range  YYYY-MM-DD strings
 * @returns {{ history: object[]|null, loading: boolean, error: string|null, fetchHistory: () => void }}
 */
export function useHistory({ startDate, endDate } = {}) {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Track the range we last fetched to re-fetch when period changes
  const lastFetchedRange = useRef(null);

  const fetchHistory = useCallback(async (forceStartDate, forceEndDate) => {
    const start = forceStartDate ?? startDate;
    const end = forceEndDate ?? endDate;
    const rangeKey = `${start}:${end}`;

    if (loading) return;
    if (lastFetchedRange.current === rangeKey && history !== null) return;

    setLoading(true);
    setError(null);

    const dateStrings = start && end ? datesBetween(start, end) : (() => {
      // Fallback: last 30 days
      const today = new Date();
      return Array.from({ length: 30 }, (_, i) => {
        const d = new Date(today);
        d.setUTCDate(d.getUTCDate() - i);
        return d.toISOString().slice(0, 10);
      }).reverse();
    })();

    try {
      const results = await Promise.allSettled(
        dateStrings.map(async (date) => {
          const res = await fetch(`${HISTORY_BASE}/${date}.json`);
          if (!res.ok) return [];
          return res.json();
        })
      );

      const allSnapshots = results
        .filter((r) => r.status === 'fulfilled')
        .flatMap((r) => r.value)
        .filter(Boolean)
        .sort((a, b) => new Date(a.updated) - new Date(b.updated));

      setHistory(allSnapshots);
      lastFetchedRange.current = rangeKey;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, loading, history]);

  return { history, loading, error, fetchHistory };
}
