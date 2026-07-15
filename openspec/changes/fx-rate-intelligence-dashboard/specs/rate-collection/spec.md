## ADDED Requirements

### Requirement: Scheduled rate scraping
The system SHALL collect FX rates from all configured sources (CBSL, Market API, BOC, People's Bank, Commercial Bank, HNB, Sampath) via a GitHub Actions workflow on a cron schedule of 3 times daily (morning, noon, evening Sri Lanka time).

#### Scenario: Successful scrape run
- **WHEN** the scheduled GitHub Actions workflow triggers
- **THEN** the scraper collects rates from all sources in parallel and writes results to `data/latest.json` and appends to `data/history/YYYY-MM-DD.json`

#### Scenario: Partial source failure
- **WHEN** one or more sources fail to respond or return unparseable data
- **THEN** the scraper SHALL write `null` for the failed source, succeed overall, and log the failure to Actions output — other sources are not affected

#### Scenario: Git commit after scrape
- **WHEN** the scraper successfully writes JSON files
- **THEN** the workflow SHALL commit and push the updated files to the repository with a descriptive commit message including the timestamp

### Requirement: Per-source scraper modules
The system SHALL implement each data source as an independent Node.js module under `scraper/sources/` returning a standardised rate object `{ sourceName, currency, buy, sell, mid, timestamp }`.

#### Scenario: Static HTML source
- **WHEN** a bank publishes rates on a static HTML page
- **THEN** the scraper module SHALL use `node-fetch` + `cheerio` to parse rates without launching a browser

#### Scenario: JS-rendered source
- **WHEN** a bank renders rates dynamically via JavaScript
- **THEN** the scraper module SHALL use Puppeteer in headless mode to extract rates

### Requirement: JSON data schema
The system SHALL store rate data in a consistent JSON schema with a top-level `updated` ISO timestamp and a `sources` object keyed by source name, each containing currency keys mapped to `{ buy, sell, mid }` objects. Missing values SHALL be `null`.

#### Scenario: latest.json written
- **WHEN** a scrape run completes
- **THEN** `data/latest.json` SHALL be overwritten with the full current snapshot conforming to the schema

#### Scenario: history file appended
- **WHEN** a scrape run completes
- **THEN** a snapshot object SHALL be appended to the array in `data/history/YYYY-MM-DD.json` for the current UTC date, creating the file if it does not exist

### Requirement: Supported currencies
The system SHALL collect rates for the following currencies where available per source: USD, GBP, EUR, AED, SAR, INR, SGD, CAD, AUD, JPY, CNY, MYR.

#### Scenario: Currency not published by a bank
- **WHEN** a bank does not publish a rate for a given currency
- **THEN** that currency's entry for that source SHALL be `null` rather than omitted

### Requirement: Market mid-rate via API
The system SHALL fetch the mid-market rate from ExchangeRate-API (free tier) as the "Market" reference source.

#### Scenario: API rate fetch
- **WHEN** the scraper runs
- **THEN** the Market source SHALL call ExchangeRate-API with the `APIKEY` secret and store mid rates for all supported currencies against LKR
