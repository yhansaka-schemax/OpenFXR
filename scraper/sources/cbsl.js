/**
 * CBSL (Central Bank of Sri Lanka) daily exchange rate scraper.
 * URL: https://www.cbsl.gov.lk/en/rates-and-indicators/exchange-rates/daily-exchange-rates
 *
 * The page is Drupal/Forena rendered — rates table loads via JavaScript.
 * Uses Puppeteer to wait for the table to render.
 *
 * Table structure (typical):
 *   Currency | Buying (TT) | Selling (TT)
 *
 * CBSL publishes mid-rates (buying ≈ selling for official rate).
 * We store the average as `mid`, and buy/sell as published.
 */

import { withBrowser, parseRate } from '../utils/browser.js';
import { SOURCE_NAMES, SUPPORTED_CURRENCIES } from '../schema.js';

const URL = 'https://www.cbsl.gov.lk/en/rates-and-indicators/exchange-rates/daily-exchange-rates';

// Map CBSL currency name patterns to our standard codes
const CURRENCY_MAP = {
  'US Dollar': 'USD',
  'USD': 'USD',
  'UK Pound': 'GBP',
  'Pound Sterling': 'GBP',
  'GBP': 'GBP',
  'Euro': 'EUR',
  'EUR': 'EUR',
  'UAE Dirham': 'AED',
  'AED': 'AED',
  'Saudi Riyal': 'SAR',
  'SAR': 'SAR',
  'Indian Rupee': 'INR',
  'INR': 'INR',
  'Singapore Dollar': 'SGD',
  'SGD': 'SGD',
  'Canadian Dollar': 'CAD',
  'CAD': 'CAD',
  'Australian Dollar': 'AUD',
  'AUD': 'AUD',
  'Japanese Yen': 'JPY',
  'JPY': 'JPY',
  'Chinese Yuan': 'CNY',
  'CNY': 'CNY',
  'Malaysian Ringgit': 'MYR',
  'MYR': 'MYR',
};

export async function scrape() {
  try {
    const rates = await withBrowser(async (page) => {
      await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });

      // Wait for the rates table to appear
      await page.waitForSelector('table', { timeout: 15000 });

      return page.evaluate((currencyMap, supported) => {
        const result = {};
        const tables = document.querySelectorAll('table');

        for (const table of tables) {
          const rows = table.querySelectorAll('tr');
          for (const row of rows) {
            const cells = row.querySelectorAll('td');
            if (cells.length < 3) continue;

            const currencyText = cells[0].textContent.trim();
            const buyText = cells[1].textContent.trim();
            const sellText = cells[2].textContent.trim();

            // Try to match currency
            let code = null;
            for (const [pattern, c] of Object.entries(currencyMap)) {
              if (currencyText.includes(pattern)) {
                code = c;
                break;
              }
            }

            if (!code) continue;

            const buy = parseFloat(buyText.replace(/,/g, '')) || null;
            const sell = parseFloat(sellText.replace(/,/g, '')) || null;
            const mid = buy && sell ? Math.round(((buy + sell) / 2) * 100) / 100 : (buy || sell);

            result[code] = {
              buy: buy > 0 ? buy : null,
              sell: sell > 0 ? sell : null,
              mid: mid > 0 ? mid : null,
            };
          }
        }
        return result;
      }, CURRENCY_MAP, SUPPORTED_CURRENCIES);
    });

    if (!rates || Object.keys(rates).length === 0) {
      console.error('[cbsl] No rates parsed from page');
      return { name: SOURCE_NAMES.CBSL, rates: null };
    }

    console.log(`[cbsl] Scraped ${Object.keys(rates).length} currencies`);
    return { name: SOURCE_NAMES.CBSL, rates };
  } catch (err) {
    console.error('[cbsl] Error:', err.message);
    return { name: SOURCE_NAMES.CBSL, rates: null };
  }
}
