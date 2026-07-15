/**
 * Market mid-rate source using ExchangeRate-API (free tier).
 * Provides the mid-market reference rate for all supported currencies vs LKR.
 * API key loaded from EXCHANGERATE_API_KEY environment variable.
 */

import fetch from 'node-fetch';
import { SUPPORTED_CURRENCIES, SOURCE_NAMES } from '../schema.js';

const BASE_URL = 'https://v6.exchangerate-api.com/v6';

/**
 * Fetches mid-market rates for all supported currencies vs LKR.
 * @returns {{ name: string, rates: Record<string, { buy: null, sell: null, mid: number|null }> | null }}
 */
export async function scrape() {
  const apiKey = process.env.EXCHANGERATE_API_KEY;
  if (!apiKey) {
    console.error('[market-api] EXCHANGERATE_API_KEY not set');
    return { name: SOURCE_NAMES.MARKET, rates: null };
  }

  try {
    const url = `${BASE_URL}/${apiKey}/latest/LKR`;
    const res = await fetch(url, { timeout: 10000 });

    if (!res.ok) {
      console.error(`[market-api] HTTP ${res.status}`);
      return { name: SOURCE_NAMES.MARKET, rates: null };
    }

    const json = await res.json();

    if (json.result !== 'success') {
      console.error('[market-api] API error:', json['error-type']);
      return { name: SOURCE_NAMES.MARKET, rates: null };
    }

    // conversion_rates is relative to LKR base — e.g. USD: 0.003125 means 1 LKR = 0.003125 USD
    // We want LKR per 1 foreign currency unit: 1 / rate
    const conversionRates = json.conversion_rates;
    const rates = {};

    for (const currency of SUPPORTED_CURRENCIES) {
      const rate = conversionRates[currency];
      if (rate && rate > 0) {
        const lkrPerUnit = Math.round((1 / rate) * 100) / 100;
        rates[currency] = { buy: null, sell: null, mid: lkrPerUnit };
      } else {
        rates[currency] = { buy: null, sell: null, mid: null };
      }
    }

    console.log(`[market-api] Fetched rates for ${Object.keys(rates).length} currencies`);
    return { name: SOURCE_NAMES.MARKET, rates };
  } catch (err) {
    console.error('[market-api] Error:', err.message);
    return { name: SOURCE_NAMES.MARKET, rates: null };
  }
}
