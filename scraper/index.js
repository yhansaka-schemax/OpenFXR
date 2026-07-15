/**
 * FXRScout scraper orchestrator.
 * Runs all source scrapers in parallel, merges results, writes JSON data files.
 *
 * Usage: node index.js
 * Env: EXCHANGERATE_API_KEY - required for market mid-rate source
 */

import { scrape as scrapeMarket } from './sources/market-api.js';
import { scrape as scrapeCBSL } from './sources/cbsl.js';
import { scrape as scrapeBOC } from './sources/boc.js';
import { scrape as scrapePeoples } from './sources/peoples.js';
import { scrape as scrapeCommercial } from './sources/commercial.js';
import { scrape as scrapeHNB } from './sources/hnb.js';
import { scrape as scrapeSampath } from './sources/sampath.js';
import { mergeRates } from './utils/mergeRates.js';
import { writeData } from './utils/writeData.js';

const SOURCES = [
  { name: 'CBSL', fn: scrapeCBSL },
  { name: 'Market', fn: scrapeMarket },
  { name: 'BOC', fn: scrapeBOC },
  { name: "People's", fn: scrapePeoples },
  { name: 'Commercial', fn: scrapeCommercial },
  { name: 'HNB', fn: scrapeHNB },
  { name: 'Sampath', fn: scrapeSampath },
];

async function run() {
  console.log(`[scraper] Starting run at ${new Date().toISOString()}`);
  console.log(`[scraper] Running ${SOURCES.length} sources in parallel...`);

  // Run all sources in parallel — failures are isolated
  const results = await Promise.allSettled(SOURCES.map(({ name, fn }) =>
    fn().catch((err) => {
      console.error(`[scraper] Source "${name}" threw unexpectedly:`, err.message);
      return { name, rates: null };
    })
  ));

  const sourceResults = results.map((result, i) => {
    if (result.status === 'rejected') {
      console.error(`[scraper] Source "${SOURCES[i].name}" rejected:`, result.reason?.message);
      return { name: SOURCES[i].name, rates: null };
    }
    return result.value;
  });

  // Log per-source summary
  for (const { name, rates } of sourceResults) {
    const status = rates ? `✓ ${Object.keys(rates).length} currencies` : '✗ failed';
    console.log(`  [${name}] ${status}`);
  }

  const sources = mergeRates(sourceResults);
  const snapshot = {
    updated: new Date().toISOString(),
    sources,
  };

  writeData(snapshot);
  console.log(`[scraper] Done at ${new Date().toISOString()}`);
}

run().catch((err) => {
  console.error('[scraper] Fatal error:', err);
  process.exit(1);
});
