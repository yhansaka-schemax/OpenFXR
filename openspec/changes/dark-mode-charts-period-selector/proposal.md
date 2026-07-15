## Why

FXRScout's dashboard is usable but lacks polish for power users: it forces a light theme, uses Recharts primitives directly (inconsistent with the shadcn/ui design system), and provides no control over the chart time window — users cannot zoom into short-term trends or compare custom ranges. These gaps hurt readability in low-light environments and reduce analytical value.

## What Changes

- Add a **dark mode toggle** (system-preference aware, with manual override persisted to `localStorage`) using Tailwind CSS v4's `dark:` variant and shadcn/ui's theming conventions
- Replace Recharts `<LineChart>` with **shadcn/ui Charts** (built on Recharts + shadcn `ChartContainer`/`ChartTooltip`/`ChartLegend`) for consistent dark-aware styling
- Add a **time period selector** to the Trends tab: preset buttons (7 days, 30 days) plus a custom date-range picker; selection slices `data/history/` snapshots before rendering
- Replace all **color-background indicators** (green/blue card tints, badge backgrounds) with a colored **`●` dot** prefix or colored icon — backgrounds remain `bg-card` (neutral); only the dot or icon carries semantic color

## Capabilities

### New Capabilities

- `dark-mode`: Toggle between light and dark themes; respects `prefers-color-scheme` on first load; persists manual choice to `localStorage`; controlled via a sun/moon icon button in the Header
- `chart-period-selector`: Preset (7d / 30d) and custom (date-range picker) selectors on the Trends tab; filters history data passed to the chart component; URL-synced (`?period=7d` / `?from=&to=`)
- `shadcn-charts`: Migrate `TrendChart` from raw Recharts to `shadcn/ui` Chart primitives (`ChartContainer`, `ChartTooltipContent`, `ChartLegendContent`) with a `chartConfig` object per source; dark-mode-aware colors via CSS variables
- `dot-indicator-style`: Audit all components that use color backgrounds as semantic indicators; replace with a `●` colored dot (`text-[color]`) or colored icon; component backgrounds use only neutral tokens (`bg-card`, `bg-muted`)

### Modified Capabilities

<!-- none — these are all new capabilities -->

## Impact

- **`src/components/Header.jsx`** — add dark mode toggle button (sun/moon icon)
- **`src/App.jsx`** — wrap root in a theme provider context; add `dark` class toggle on `<html>`
- **`src/components/TrendChart.jsx`** — rewrite to use `ChartContainer`/`ChartTooltipContent` from `@/components/ui/chart`
- **`src/components/BestRateSummary.jsx`** — remove green/blue `bg-*` tints; add colored dot
- **`src/components/RateTable.jsx`** — remove any residual badge background colors; use dot or icon
- **`src/components/ui/chart.jsx`** — new shadcn chart primitive (manual creation)
- **`src/hooks/useHistory.js`** — expose filtered slice by date range
- **`src/index.css`** — add `dark` CSS variable block (shadcn dark theme tokens)
- **`package.json`** — may add `lucide-react` if not present (for sun/moon icons); add `react-day-picker` + `date-fns` for custom date range picker
