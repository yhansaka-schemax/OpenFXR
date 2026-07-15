import { SUPPORTED_CURRENCIES, emptyRate } from '../schema.js';

/**
 * Merges an array of per-source rate results into a single sources object.
 * Each result should be: { name: string, rates: Record<currency, { buy, sell, mid }> | null }
 *
 * Missing currencies default to null values. Failed sources (null rates) are included
 * with all-null values so the dashboard knows the source exists but failed.
 *
 * @param {Array<{ name: string, rates: Record<string, object> | null }>} sourceResults
 * @returns {Record<string, Record<string, { buy: number|null, sell: number|null, mid: number|null }>>}
 */
export function mergeRates(sourceResults) {
  const sources = {};

  for (const { name, rates } of sourceResults) {
    sources[name] = {};

    for (const currency of SUPPORTED_CURRENCIES) {
      if (!rates) {
        // Source failed — record nulls
        sources[name][currency] = emptyRate();
      } else {
        const raw = rates[currency];
        sources[name][currency] = {
          buy: raw?.buy ?? null,
          sell: raw?.sell ?? null,
          mid: raw?.mid ?? null,
        };
      }
    }
  }

  return sources;
}
