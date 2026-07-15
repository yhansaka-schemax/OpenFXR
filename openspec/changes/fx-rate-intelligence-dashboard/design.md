## Context

FXRScout is a zero-infrastructure FX rate intelligence dashboard for Sri Lanka. There is no existing codebase — this is a greenfield project. The key constraint is that everything must live in a single GitHub repository with no external servers, databases, or paid services. GitHub Actions handles scheduling, git handles persistence, and GitHub Pages serves the frontend.

Sri Lankan banks publish FX rates on their websites (some static HTML, some JS-rendered). The Central Bank of Sri Lanka (CBSL) publishes official daily rates. A free exchange rate API provides the mid-market rate as a reference benchmark.

## Goals / Non-Goals

**Goals:**
- Collect FX rates from 5+ Sri Lankan banks + CBSL + market mid-rate on a scheduled basis
- Store all collected data as JSON files committed to the repository
- Display a live rate comparison table with spread % vs CBSL mid-rate
- Show historical trend charts per bank/currency using accumulated JSON history
- Highlight the best buy and sell rate for the selected currency
- Support 10+ currencies (USD, GBP, EUR, AED, SAR, INR, SGD, CAD, AUD, JPY, CNY, MYR)
- Deploy entirely on GitHub (Actions + Pages), zero cost

**Non-Goals:**
- User accounts, authentication, or personalization
- Real-time rate streaming (scheduled polling is sufficient)
- Mobile app
- Rate alerts or notifications (future capability)
- Currency conversion calculator (future)
- Banks outside Sri Lanka

## Decisions

### D1: Git as the database (JSON files committed to repo)

**Decision:** Store all rate data as JSON files in `data/` directory, committed by the GitHub Actions scraper on each run.

**Rationale:** Eliminates all infrastructure — no Postgres, Redis, or any server. Git provides full audit history for free. GitHub Pages can fetch JSON files directly. The data volume (~15 banks × 15 currencies × 3 runs/day) produces negligible repo growth (~1MB/year).

**Alternatives considered:**
- Supabase/PlanetScale free tier — adds external dependency, auth complexity, potential cost
- GitHub Releases as artifact storage — more complex than direct file commits
- Browser localStorage — no persistence across devices/users

**File layout:**
```
data/
├── latest.json          ← overwritten on every scraper run
└── history/
    ├── 2026-07-14.json  ← one file per day, array of snapshots
    └── 2026-07-13.json
```

**latest.json shape:**
```json
{
  "updated": "2026-07-14T07:30:00Z",
  "sources": {
    "CBSL":    { "USD": { "buy": 320.00, "sell": 320.00 }, ... },
    "Market":  { "USD": { "mid": 319.80 }, ... },
    "BOC":     { "USD": { "buy": 318.50, "sell": 323.00 }, ... },
    "Sampath": { "USD": { "buy": 317.75, "sell": 324.50 }, ... }
  }
}
```

---

### D2: Node.js scraper with per-source modules

**Decision:** Each bank/source is an independent Node.js module under `scraper/sources/`. An orchestrator `scraper/index.js` runs all sources in parallel, merges results, and writes JSON.

**Rationale:** Isolation means one failing source doesn't block others. Each scraper can use the right tool (cheerio for static HTML, puppeteer for JS-rendered pages).

**Alternatives considered:**
- Python (playwright) — equally capable but adds Python runtime to Actions setup
- Single monolithic scraper — harder to maintain as sources change independently

**Puppeteer usage:** Only for banks that render rates via JavaScript. Static HTML banks use lightweight `cheerio` + `node-fetch` to keep scraper fast and Actions minutes low.

---

### D3: React + Vite + GitHub Pages for the dashboard

**Decision:** Static React app built with Vite, deployed to GitHub Pages via a separate Actions workflow triggered on pushes to `main` or data changes.

**Rationale:** React is the team's preferred stack. Vite provides fast builds and HMR. GitHub Pages hosts static files for free. The dashboard fetches `data/latest.json` and `data/history/*.json` at runtime — no backend needed.

**Alternatives considered:**
- Next.js — overkill for a fully static site with no SSR needs
- Svelte/Vue — team preference is React

---

### D4: Scraper runs 3x daily via GitHub Actions cron

**Decision:** Schedule: `0 3,7,11 * * *` UTC (≈ 8:30am, 12:30pm, 4:30pm Sri Lanka time).

**Rationale:** Banks update rates in the morning and sometimes midday. 3 captures/day gives meaningful intraday trend data without excessive Actions minutes usage.

**Alternatives considered:**
- Every hour — uses too many Actions minutes, bank rates don't change that frequently
- Once daily — misses intraday updates

---

### D5: ExchangeRate-API for mid-market reference rate

**Decision:** Use [ExchangeRate-API](https://www.exchangerate-api.com/) free tier (1,500 requests/month) as the market mid-rate source, labelled "Market Rate" in the UI.

**Rationale:** Free, reliable, no ToS concerns (unlike scraping Google). 1,500 req/month far exceeds our 3×30 = 90 req/month usage.

**Alternatives considered:**
- Frankfurter.app — free but ECB-based, doesn't include LKR
- Scraping Google Finance — fragile, ToS risk

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Bank website structure changes, breaking scrapers | Per-source isolation — only that source fails. Add error reporting to Actions output. Scraper writes `null` for failed source rather than crashing. |
| GitHub Actions free tier minutes (2000/month) | 3 runs/day × ~5 min/run = 450 min/month. Well within free tier. |
| Repo size grows unbounded over years | History files are small JSON. At ~1MB/year, manageable for 5+ years. Can archive old history if needed. |
| JS-rendered bank pages (Puppeteer) slow scraper | Run Puppeteer sources in parallel. Cache bank pages where possible. |
| CBSL publishes rates late or on holidays | Scraper carries forward last known CBSL rate with a staleness timestamp. |
| GitHub Pages cold cache on first load | Preload `latest.json` eagerly; history loaded lazily on chart interaction. |

## Open Questions

- Which specific banks render rates with JavaScript vs static HTML? (needs investigation per bank during implementation)
- Does CBSL publish an XML/JSON feed, or HTML-only? (XML feed would be more reliable than HTML scraping)
- Should history files accumulate all snapshots per day (array) or just the last snapshot? (array preferred for intraday trends)
