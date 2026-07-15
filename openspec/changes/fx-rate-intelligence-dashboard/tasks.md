## 1. Project Scaffolding

- [x] 1.1 Initialise Vite + React project in repo root (`npm create vite@latest . -- --template react`)
- [x] 1.2 Install frontend dependencies: `recharts`, `tailwindcss`, `@tailwindcss/vite`, `clsx`
- [x] 1.3 Configure Tailwind CSS
- [x] 1.4 Configure Vite `base` path for GitHub Pages deployment
- [x] 1.5 Create `scraper/` directory with `package.json` (Node.js, separate from frontend)
- [x] 1.6 Install scraper dependencies: `node-fetch`, `cheerio`, `puppeteer`
- [x] 1.7 Create `data/` directory with `.gitkeep` and add `data/history/` subdirectory
- [x] 1.8 Create `.gitignore` entries for `node_modules`, `dist`, scraper secrets

## 2. Data Schema & Utilities

- [x] 2.1 Define and document `latest.json` schema in `scraper/schema.js` with a validation helper
- [x] 2.2 Write `scraper/utils/writeData.js` — merges source results, writes `data/latest.json` and appends to `data/history/YYYY-MM-DD.json`
- [x] 2.3 Write `scraper/utils/mergeRates.js` — merges per-source rate objects, handles nulls for missing currencies

## 3. Scraper Sources

- [x] 3.1 Implement `scraper/sources/market-api.js` — fetch mid-rates from ExchangeRate-API for all supported currencies vs LKR
- [x] 3.2 Investigate CBSL website rate publishing format (HTML table vs XML/JSON feed)
- [x] 3.3 Implement `scraper/sources/cbsl.js` — scrape/fetch CBSL daily mid-rates
- [x] 3.4 Investigate BOC website rate page (static vs JS-rendered)
- [x] 3.5 Implement `scraper/sources/boc.js`
- [x] 3.6 Investigate People's Bank rate page
- [x] 3.7 Implement `scraper/sources/peoples.js`
- [x] 3.8 Investigate Commercial Bank rate page
- [x] 3.9 Implement `scraper/sources/commercial.js`
- [x] 3.10 Investigate HNB rate page
- [x] 3.11 Implement `scraper/sources/hnb.js`
- [x] 3.12 Investigate Sampath Bank rate page
- [x] 3.13 Implement `scraper/sources/sampath.js`
- [x] 3.14 Implement `scraper/index.js` — orchestrate all sources in parallel, handle per-source errors gracefully, write output via `writeData.js`

## 4. GitHub Actions — Scraper Workflow

- [x] 4.1 Create `.github/workflows/scrape.yml` with cron `0 3,7,11 * * *` UTC schedule
- [x] 4.2 Configure workflow steps: checkout, setup Node, install scraper deps, run scraper, commit & push data files
- [x] 4.3 Add `EXCHANGERATE_API_KEY` as a GitHub Actions secret and reference it in workflow env
- [x] 4.4 Add `workflow_dispatch` trigger to allow manual scrape runs
- [ ] 4.5 Test workflow with a manual trigger and verify `data/latest.json` is committed correctly

## 5. React Dashboard — Core Layout

- [x] 5.1 Create `src/App.jsx` with top-level layout: header, currency selector, main content area, footer
- [x] 5.2 Create `src/hooks/useLatestRates.js` — fetch `data/latest.json`, expose `{ data, loading, error, lastUpdated }`
- [x] 5.3 Create `src/hooks/useHistory.js` — lazy-fetch last 30 days of history JSON files on demand
- [x] 5.4 Create `src/components/Header.jsx` with app name, last updated relative timestamp
- [x] 5.5 Create `src/components/CurrencySelector.jsx` — tab/pill selector for 12 currencies, synced to `?currency=` URL param, greyed out for currencies with no data

## 6. React Dashboard — Comparison View

- [x] 6.1 Create `src/components/BestRateSummary.jsx` — summary card showing best buy source/rate and best sell source/rate for selected currency
- [x] 6.2 Create `src/components/RateTable.jsx` — comparison table with columns: Source, Buy, Sell, Spread %, Updated; sorted by best buy; "Best Buy" and "Best Sell" badges on winning rows
- [x] 6.3 Implement spread calculation utility `src/utils/calcSpread.js` — `((bank_buy - cbsl_mid) / cbsl_mid) * 100`
- [x] 6.4 Handle N/A display for null rates, and CBSL staleness warning (>48h)

## 7. React Dashboard — Trends View

- [x] 7.1 Create `src/components/TrendChart.jsx` — Recharts `LineChart` with one line per source for selected currency, CBSL as dashed reference line
- [x] 7.2 Implement source toggle via legend click
- [x] 7.3 Show "Not enough history yet" message when fewer than 3 days of data exist
- [x] 7.4 Wire lazy history loading — fetch only when trends view is opened

## 8. GitHub Actions — Deploy Workflow

- [x] 8.1 Create `.github/workflows/deploy.yml` — trigger on push to `main` and on completion of scrape workflow
- [x] 8.2 Configure workflow: checkout, setup Node, install frontend deps, `npm run build`, deploy `dist/` to GitHub Pages
- [ ] 8.3 Enable GitHub Pages in repo settings (source: GitHub Actions)
- [ ] 8.4 Verify deployed dashboard loads and fetches `data/latest.json` correctly

## 9. Polish & Validation

- [x] 9.1 Test currency selector URL persistence (`?currency=GBP` loads correctly)
- [x] 9.2 Test partial scraper failure — mock one source returning null, verify others still written
- [x] 9.3 Test dashboard with 0, 1, and 30 days of history
- [x] 9.4 Add loading skeletons for rate table and chart while data fetches
- [x] 9.5 Verify mobile responsiveness of comparison table and chart
- [x] 9.6 Update `openspec/config.yaml` with project context (tech stack, conventions)
