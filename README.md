# FXRScout 🇱🇰

Foreign Exchange Rate Intelligence Dashboard for Sri Lanka.

Monitors FX rates across major Sri Lankan banks, comparing against CBSL official rates with historical trend charts. Zero infrastructure — GitHub Actions scrapes rates and commits JSON to this repo; GitHub Pages hosts the dashboard.

## Data Sources

| Source | Type | Coverage |
|--------|------|----------|
| CBSL | Official mid-rate | All major currencies |
| Market (ExchangeRate-API) | Mid-market reference | All major currencies |
| BOC | TT buy/sell | 12 currencies |
| People's Bank | TT buy/sell | 10 currencies |
| Commercial Bank | TT buy/sell | 11 currencies |
| HNB | TT buy/sell | 11 currencies |
| Sampath Bank | TT buy/sell | 12 currencies |

## Currencies

USD, GBP, EUR, AED, SAR, INR, SGD, CAD, AUD, JPY, CNY, MYR

## Setup

### 1. Add GitHub Actions Secret

In your repo → **Settings → Secrets and variables → Actions**, add:
- `EXCHANGERATE_API_KEY` — free API key from [exchangerate-api.com](https://www.exchangerate-api.com/)

### 2. Enable GitHub Pages

In your repo → **Settings → Pages**, set:
- Source: **GitHub Actions**

### 3. First data run

Trigger the **Scrape FX Rates** workflow manually from the Actions tab to generate the first `data/latest.json`.

## Local Development

```bash
# Frontend
npm install
npm run dev

# Scraper (requires EXCHANGERATE_API_KEY in environment)
cd scraper
npm install
EXCHANGERATE_API_KEY=your_key node index.js
```

## Architecture

```
.github/workflows/
  scrape.yml      # Cron: 3x daily, scrapes all sources, commits JSON
  deploy.yml      # Deploys React app to GitHub Pages on push/scrape

scraper/
  index.js        # Orchestrator — runs all sources in parallel
  schema.js       # JSON schema + validation
  sources/        # One file per bank/source
  utils/          # mergeRates.js, writeData.js, browser.js

data/
  latest.json          # Current snapshot (overwritten each run)
  history/
    YYYY-MM-DD.json    # Daily snapshots array (appended each run)

src/
  App.jsx              # Main app with view routing + URL state
  components/          # Header, CurrencySelector, BestRateSummary, RateTable, TrendChart
  hooks/               # useLatestRates, useHistory (lazy)
  utils/               # calcSpread, formatTime
```

## Data disclaimer

Rate data is collected from public bank websites. Not financial advice. Always confirm rates directly with your bank.


- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
