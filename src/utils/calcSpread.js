/**
 * Calculates spread percentage of a bank buy rate vs CBSL mid-rate.
 * Formula: ((bank_buy - cbsl_mid) / cbsl_mid) * 100
 *
 * @param {number|null} bankBuy
 * @param {number|null} cbslMid
 * @returns {number|null} spread percentage, or null if either value is missing
 */
export function calcSpread(bankBuy, cbslMid) {
  if (!bankBuy || !cbslMid || cbslMid === 0) return null;
  return Math.round(((bankBuy - cbslMid) / cbslMid) * 10000) / 100;
}

/**
 * Formats a spread value as a signed percentage string, e.g. "-0.47%" or "+0.23%"
 * @param {number|null} spread
 * @returns {string}
 */
export function formatSpread(spread) {
  if (spread === null) return '—';
  const sign = spread >= 0 ? '+' : '';
  return `${sign}${spread.toFixed(2)}%`;
}
