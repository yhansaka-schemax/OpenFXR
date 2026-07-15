/**
 * People's Bank exchange rate scraper.
 * URL: https://www.peoplesbank.lk/rates-tariffs/foreign-exchange-rates/
 */

import { withBrowser } from '../utils/browser.js';
import { SOURCE_NAMES } from '../schema.js';

const URL = 'https://www.peoplesbank.lk/rates-tariffs/foreign-exchange-rates/';

const CURRENCY_MAP = {
  'USD': 'USD', 'US DOLLAR': 'USD', 'UNITED STATES': 'USD',
  'GBP': 'GBP', 'STERLING': 'GBP', 'POUND': 'GBP',
  'EUR': 'EUR', 'EURO': 'EUR',
  'AED': 'AED', 'UAE': 'AED', 'DIRHAM': 'AED',
  'SAR': 'SAR', 'SAUDI': 'SAR', 'RIYAL': 'SAR',
  'INR': 'INR', 'INDIAN': 'INR',
  'SGD': 'SGD', 'SINGAPORE': 'SGD',
  'CAD': 'CAD', 'CANADIAN': 'CAD',
  'AUD': 'AUD', 'AUSTRALIAN': 'AUD',
  'JPY': 'JPY', 'JAPAN': 'JPY', 'YEN': 'JPY',
  'CNY': 'CNY', 'CHINESE': 'CNY', 'YUAN': 'CNY',
  'MYR': 'MYR', 'MALAYSIAN': 'MYR', 'RINGGIT': 'MYR',
};

export async function scrape() {
  try {
    const rates = await withBrowser(async (page) => {
      await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.waitForSelector('table', { timeout: 15000 });

      return page.evaluate((currencyMap) => {
        const result = {};
        const tables = document.querySelectorAll('table');

        for (const table of tables) {
          const rows = table.querySelectorAll('tr');
          for (const row of rows) {
            const cells = row.querySelectorAll('td');
            if (cells.length < 3) continue;

            const currencyText = cells[0].textContent.trim().toUpperCase();
            let code = null;
            for (const [pattern, c] of Object.entries(currencyMap)) {
              if (currencyText.includes(pattern)) { code = c; break; }
            }
            if (!code) continue;

            const buy = parseFloat(cells[1]?.textContent.replace(/,/g, '').trim()) || null;
            const sell = parseFloat(cells[2]?.textContent.replace(/,/g, '').trim()) || null;
            result[code] = { buy: buy > 0 ? buy : null, sell: sell > 0 ? sell : null, mid: null };
          }
        }
        return result;
      }, CURRENCY_MAP);
    });

    if (!rates || Object.keys(rates).length === 0) {
      console.error("[peoples] No rates parsed"); return { name: SOURCE_NAMES.PEOPLES, rates: null };
    }
    console.log(`[peoples] Scraped ${Object.keys(rates).length} currencies`);
    return { name: SOURCE_NAMES.PEOPLES, rates };
  } catch (err) {
    console.error('[peoples] Error:', err.message);
    return { name: SOURCE_NAMES.PEOPLES, rates: null };
  }
}
