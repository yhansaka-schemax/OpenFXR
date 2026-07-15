## Context

FXRScout is a fully static React 19 + Vite + Tailwind CSS v4 app deployed to GitHub Pages. The UI was recently migrated to shadcn/ui components (cards, table, badges, tabs, buttons). The `TrendChart` component uses raw Recharts. There is no server — all state is in the React tree + URL params + `localStorage`.

Current pain points:
- No dark mode: hardcoded light-only CSS variable blocks in `index.css`
- Chart uses raw Recharts `<LineChart>` directly, not the shadcn Chart primitives
- Trends tab has no time-window control; `useHistory` always fetches last 30 days
- Several components use color-filled backgrounds (`bg-green-50`, `bg-blue-50`) as semantic indicators — these look jarring in dark mode and are harder to theme

## Goals / Non-Goals

**Goals:**
- Dark mode that follows OS preference, with manual override persisted to `localStorage`
- shadcn Chart primitives (`ChartContainer`, `ChartTooltipContent`, `ChartLegendContent`) in `TrendChart`
- Time period selector on Trends tab: "7d" / "30d" presets + custom date-range picker; URL-synced
- Replace all color backgrounds with neutral tokens; use `●` dot or icon for semantic color

**Non-Goals:**
- Per-currency color themes
- Server-side rendering or SSR
- Scraper changes (dark mode is frontend only)
- Animated theme transitions

## Decisions

### D1: Theme provider via `useTheme` hook + `<html>` class toggle
**Decision:** Use a custom `useTheme` hook (`src/hooks/useTheme.js`) that manages a `theme` state (`"light"` | `"dark"`). The hook adds/removes the `dark` class on `document.documentElement` as a side effect. A `ThemeProvider` context wrapper is not needed; the hook can be called at the `App` level and the toggle function passed down to `Header` via prop or a small context.

**Alternatives considered:**
- `next-themes` library → overkill for a static Vite app; adds 3.5 kB
- CSS-only `prefers-color-scheme` with no toggle → doesn't allow manual override
- React Context ThemeProvider → viable but adds boilerplate; direct hook is simpler for a single-page app

**Rationale:** Tailwind CSS v4 supports `dark:` class variant natively. Adding/removing `dark` on `<html>` is the standard shadcn/ui dark mode pattern. A hook keeps it co-located and testable.

### D2: shadcn Chart primitives (manual creation — no CLI)
**Decision:** Manually create `src/components/ui/chart.jsx` following the shadcn/ui chart primitive source. The `chartConfig` object lives in `TrendChart.jsx` and maps each source name to a `label` and CSS variable color (e.g., `--color-boc`). Chart CSS variable colors are defined per-source in `src/index.css` in both `:root` (light) and `.dark` (dark) blocks.

**Alternatives considered:**
- Keep raw Recharts → tooltip/legend don't inherit shadcn theme tokens, dark mode breaks styling
- Use Tremor charts → separate design system, conflicts with shadcn/ui

**Rationale:** shadcn chart primitives are a thin wrapper over Recharts with `ChartStyle` CSS injection and `ChartTooltipContent` / `ChartLegendContent` that auto-read the `chartConfig`. This is the minimal integration cost with maximum dark-mode benefit.

### D3: Period selector state in URL, derived computation in hook
**Decision:** Period selection state lives entirely in the URL (`?period=7d`, `?period=30d`, `?from=YYYY-MM-DD&to=YYYY-MM-DD`). A `usePeriod` hook (`src/hooks/usePeriod.js`) reads/writes the URL and returns `{ startDate, endDate, preset, setPreset, setCustomRange }`. `useHistory` is refactored to accept a `{ startDate, endDate }` and fetch only needed history files.

**Alternatives considered:**
- React state only (no URL sync) → sharing/refreshing loses period selection
- Redux/Zustand → unnecessary weight for two date params
- Single `data/history/all.json` file → too large as data grows; current per-day files are better

**Rationale:** The URL is the right source of truth for shareable view state in a static app. Per-day JSON files already exist — the hook just needs to fetch the relevant files within the date range. For the custom date picker, `react-day-picker` (already Radix-compatible) + `date-fns` for date arithmetic gives a polished picker with minimal bundle impact.

### D4: Dot indicator via inline `<span aria-hidden>●</span>`
**Decision:** Replace all color-background badges and card tints with a `<span aria-hidden="true" className="text-[color]">●</span>` element before the label. For Alert components, the warning icon (`AlertTriangle` from `lucide-react`) retains its color; the `Alert` background becomes `bg-muted`. `CurrencySelector` active state switches from filled button to `ring-2 ring-primary` outline.

**Alternatives considered:**
- Colored border-left stripe → harder to implement in Table cells
- Icon-only (no dot) → inconsistent; some labels lack natural icons

**Rationale:** A `●` Unicode dot is universally available, renders consistently across fonts, requires no SVG, and is a single character. The `aria-hidden` ensures screen readers read only the label, satisfying accessibility requirements.

## Risks / Trade-offs

- **Tailwind v4 dark: variant requires `darkMode: 'class'` config** → Tailwind v4 enables class-based dark mode by default when `dark:` classes are present; no explicit config needed. Low risk.
- **`useHistory` fetching many day files for custom ranges** → A 90-day custom range would trigger 90 fetch requests to GitHub Pages. Mitigation: cap custom range at 90 days in the UI; future optimisation could batch into monthly files.
- **`react-day-picker` + `date-fns` bundle size** → ~35 kB gzipped combined. Acceptable for a dashboard app; no impact on scraper.
- **shadcn `chart.jsx` manual maintenance** → Not managed by the shadcn CLI; if upstream updates the primitive, we must update manually. Mitigation: document the source version in a comment.

## Migration Plan

1. Add dark mode CSS variable block to `src/index.css` (`.dark { ... }` tokens)
2. Create `src/hooks/useTheme.js`; update `App.jsx` and `Header.jsx`
3. Create `src/components/ui/chart.jsx`; rewrite `TrendChart.jsx`
4. Add `react-day-picker` + `date-fns` to `package.json`
5. Create `src/hooks/usePeriod.js`; update `App.jsx` and `TrendChart.jsx`
6. Audit and update `BestRateSummary`, `RateTable`, `CurrencySelector` for dot-indicator style

No backend changes. Rollback: revert the relevant component files; the scraper and data are unaffected.

## Open Questions

- Should the custom date picker show a calendar popover (DayPicker) or two plain `<input type="date">` fields? → Prefer `DayPicker` in a Popover for polished UX; fallback to `<input type="date">` if bundle size is a concern after review.
- Should the Trends tab default to "7d" or "30d"? → Default to "30d" to show more context on first open.
