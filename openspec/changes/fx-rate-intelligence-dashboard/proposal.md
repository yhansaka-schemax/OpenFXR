## Why

Sri Lankans exchanging foreign currency — travelers, importers, diaspora recipients — have no single place to compare rates across banks or understand how commercial rates compare to the official CBSL rate. FXRScout solves this by monitoring multiple Sri Lankan banks' FX rates, tracking history, and surfacing trends — all without any backend infrastructure, using GitHub as the data store.

## What Changes

- Introduce a scheduled GitHub Actions scraper that collects FX rates from Sri Lankan banks, CBSL, and a market mid-rate API
- Store collected rates as JSON files committed directly to the repository (no database)
- Build a React + Vite static web dashboard deployed on GitHub Pages
- Dashboard shows live rate comparison table, spread vs CBSL reference, trend charts, and best-rate highlighting across currencies

## Capabilities

### New Capabilities

- `rate-collection`: Scheduled scraping of FX rates from CBSL, market API (mid-rate), BOC, People's Bank, Commercial Bank, HNB, Sampath — committed as JSON to `data/latest.json` and `data/history/YYYY-MM-DD.json`
- `rate-comparison`: Dashboard view comparing buy/sell rates across all sources for a selected currency, with spread % calculated against CBSL mid-rate
- `rate-trends`: Time-series charts showing rate history per bank and currency using accumulated daily JSON history files
- `best-rate-highlight`: Visual indicator identifying which bank offers the best buy and sell rate for the selected currency at any point in time
- `currency-selector`: UI control to switch between supported currencies (USD, GBP, EUR, AED, SAR, INR, SGD, CAD, AUD, JPY, CNY, MYR)

### Modified Capabilities

## Impact

- New GitHub Actions workflow (`.github/workflows/scrape.yml`) running on cron schedule
- New `scraper/` directory with Node.js scrapers per bank source
- New `data/` directory tracked in git containing JSON rate files
- New React + Vite app in `src/` built and deployed to GitHub Pages via Actions
- Dependencies: Node.js (scraper), React, Vite, Recharts, Tailwind CSS, Puppeteer (for JS-rendered bank pages), an exchange rate API (free tier) for mid-rate
