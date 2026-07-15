import { useState, useCallback } from 'react';
import { subDays, format, parseISO, isValid } from 'date-fns';

function todayStr() {
  return format(new Date(), 'yyyy-MM-dd');
}

function daysAgoStr(n) {
  return format(subDays(new Date(), n), 'yyyy-MM-dd');
}

function parseURL() {
  const params = new URLSearchParams(window.location.search);
  const period = params.get('period');
  const from = params.get('from');
  const to = params.get('to');

  if (period === '7d') {
    return { preset: '7d', startDate: daysAgoStr(7), endDate: todayStr() };
  }
  if (from && to) {
    const start = parseISO(from);
    const end = parseISO(to);
    if (isValid(start) && isValid(end)) {
      return { preset: 'custom', startDate: from, endDate: to };
    }
  }
  // Default: 30d
  return { preset: '30d', startDate: daysAgoStr(30), endDate: todayStr() };
}

function pushURL(params) {
  const url = new URL(window.location.href);
  // Clear all period-related params first
  url.searchParams.delete('period');
  url.searchParams.delete('from');
  url.searchParams.delete('to');
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  window.history.replaceState(null, '', url.toString());
}

/**
 * Manages the chart time period selection with URL sync.
 * @returns {{ startDate: string, endDate: string, preset: '7d'|'30d'|'custom', setPreset, setCustomRange }}
 */
export function usePeriod() {
  const [state, setState] = useState(parseURL);

  const setPreset = useCallback((preset) => {
    const days = preset === '7d' ? 7 : 30;
    const startDate = daysAgoStr(days);
    const endDate = todayStr();
    setState({ preset, startDate, endDate });
    pushURL({ period: preset });
  }, []);

  const setCustomRange = useCallback((startDate, endDate) => {
    if (!startDate || !endDate) return;
    setState({ preset: 'custom', startDate, endDate });
    pushURL({ from: startDate, to: endDate });
  }, []);

  return { ...state, setPreset, setCustomRange };
}
