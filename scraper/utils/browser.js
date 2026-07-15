/**
 * Shared Puppeteer browser utility for scraper sources.
 * Creates a lightweight headless browser instance for JS-rendered bank pages.
 */

import puppeteer from 'puppeteer';

/**
 * Launches a Puppeteer browser, runs the given async function with a page, then closes.
 * @param {(page: import('puppeteer').Page) => Promise<T>} fn
 * @returns {Promise<T>}
 */
export async function withBrowser(fn) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    // Block images/fonts/media to speed up scraping
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      if (['image', 'font', 'media', 'stylesheet'].includes(type)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    return await fn(page);
  } finally {
    await browser.close();
  }
}

/**
 * Parses a rate string like "320.50" or "3,20.50" into a float, or returns null.
 * @param {string|undefined} str
 * @returns {number|null}
 */
export function parseRate(str) {
  if (!str) return null;
  const cleaned = str.replace(/,/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) || num <= 0 ? null : Math.round(num * 100) / 100;
}
