/**
 * JSON schema definition and validation for FXRScout rate data.
 *
 * latest.json shape:
 * {
 *   "updated": "<ISO 8601 timestamp>",
 *   "sources": {
 *     "<SourceName>": {
 *       "<CURRENCY>": { "buy": <number|null>, "sell": <number|null>, "mid": <number|null> }
 *     }
 *   }
 * }
 */

export const SUPPORTED_CURRENCIES = [
  'USD', 'GBP', 'EUR', 'AED', 'SAR', 'INR', 'SGD', 'CAD', 'AUD', 'JPY', 'CNY', 'MYR',
];

export const SOURCE_NAMES = {
  CBSL: 'CBSL',
  MARKET: 'Market',
  BOC: 'BOC',
  PEOPLES: "People's",
  COMMERCIAL: 'Commercial',
  HNB: 'HNB',
  SAMPATH: 'Sampath',
};

/**
 * Creates an empty rate entry with all values null.
 * @returns {{ buy: null, sell: null, mid: null }}
 */
export function emptyRate() {
  return { buy: null, sell: null, mid: null };
}

/**
 * Creates an empty source record with null rates for all supported currencies.
 * @returns {Record<string, { buy: null, sell: null, mid: null }>}
 */
export function emptySourceRates() {
  return Object.fromEntries(SUPPORTED_CURRENCIES.map((c) => [c, emptyRate()]));
}

/**
 * Validates a latest.json snapshot object.
 * Returns { valid: true } or { valid: false, errors: string[] }.
 *
 * @param {unknown} snapshot
 * @returns {{ valid: boolean, errors?: string[] }}
 */
export function validateSnapshot(snapshot) {
  const errors = [];

  if (!snapshot || typeof snapshot !== 'object') {
    return { valid: false, errors: ['snapshot must be an object'] };
  }

  if (typeof snapshot.updated !== 'string' || isNaN(Date.parse(snapshot.updated))) {
    errors.push('snapshot.updated must be a valid ISO 8601 timestamp string');
  }

  if (!snapshot.sources || typeof snapshot.sources !== 'object') {
    errors.push('snapshot.sources must be an object');
  } else {
    for (const [sourceName, currencies] of Object.entries(snapshot.sources)) {
      if (!currencies || typeof currencies !== 'object') {
        errors.push(`sources.${sourceName} must be an object`);
        continue;
      }
      for (const [currency, rates] of Object.entries(currencies)) {
        if (!rates || typeof rates !== 'object') {
          errors.push(`sources.${sourceName}.${currency} must be an object`);
          continue;
        }
        for (const field of ['buy', 'sell', 'mid']) {
          const val = rates[field];
          if (val !== null && typeof val !== 'number') {
            errors.push(
              `sources.${sourceName}.${currency}.${field} must be a number or null, got ${typeof val}`
            );
          }
        }
      }
    }
  }

  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}
