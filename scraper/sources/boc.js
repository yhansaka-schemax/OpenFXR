/**
 * Bank of Ceylon (BOC) exchange rate scraper.
 * URL: https://www.boc.lk/exchange-rates
 *
 * BOC publishes TT (Telegraphic Transfer) buying and selling rates.
 * Site uses CloudFront — requires Puppeteer with a real browser UA.
 */

import { withBrowser, parseRate } from '../utils/browser.js';
import { SOURCE_NAMES } from '../schema.js';

const URL = 'https://www.boc.lk/exchange-rates';

const CURRENCY_MAP = {
  'USD': 'USD', 'US Dollar': 'USD', 'United States': 'USD',
  'GBP': 'GBP', 'Sterling': 'GBP', 'Pound': 'GBP',
  'EUR': 'EUR', 'Euro': 'EUR',
  'AED': 'AED', 'UAE': 'AED', 'Dirham': 'AED',
  'SAR': 'SAR', 'Saudi': 'SAR', 'Riyal': 'SAR',
  'INR': 'INR', 'Indian': 'INR',
  'SGD': 'SGD', 'Singapore': 'SGD',
  'CAD': 'CAD', 'Canadian': 'CAD',
  'AUD': 'AUD', 'Australian': 'AUD',
  'JPY': 'JPY', 'Japan': 'JPY', 'Yen': 'JPY',
  'CNY': 'CNY', 'Chinese': 'CNY', 'Yuan': 'CNY',
  'MYR': 'MYR', 'Malaysian': 'MYR', 'Ringgit': 'MYR',
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
              if (currencyText.includes(pattern.toUpperCase())) {
                code = c;
                break;
              }
            }
            if (!code) continue;

            // BOC table: Currency | Buying TT | Selling TT (sometimes more columns)
            const buyIdx = 1;
            const sellIdx = cells.length >= 4 ? 2 : 2;
            const buy = parseFloat(cells[buyIdx]?.textContent.replace(/,/g, '').trim()) || null;
            const sell = parseFloat(cells[sellIdx]?.textContent.replace(/,/g, '').trim()) || null;

            result[code] = {
              buy: buy > 0 ? buy : null,
              sell: sell > 0 ? sell : null,
              mid: null,
            };
          }
        }
        return result;
      }, CURRENCY_MAP);
    });

    if (!rates || Object.keys(rates).length === 0) {
      console.error('[boc] No rates parsed from page');
      return { name: SOURCE_NAMES.BOC, rates: null };
    }

    console.log(`[boc] Scraped ${Object.keys(rates).length} currencies`);
    return { name: SOURCE_NAMES.BOC, rates };
  } catch (err) {
    console.error('[boc] Error:', err.message);
    return { name: SOURCE_NAMES.BOC, rates: null };
  }
}
