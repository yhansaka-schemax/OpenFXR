## 1. Dark Mode — CSS Variables

- [x] 1.1 Add `.dark { ... }` CSS variable block to `src/index.css` with shadcn dark theme HSL tokens (background, foreground, card, muted, border, input, ring, primary, destructive, etc.)
- [x] 1.2 Add chart source color CSS variables for both `:root` (light) and `.dark` in `src/index.css`: `--color-cbsl`, `--color-market`, `--color-boc`, `--color-peoples`, `--color-commercial`, `--color-hnb`, `--color-sampath`

## 2. Dark Mode — useTheme Hook

- [x] 2.1 Create `src/hooks/useTheme.js` — reads `localStorage["fxrscout-theme"]`, falls back to `prefers-color-scheme`, applies `dark` class to `document.documentElement`, returns `{ theme, toggleTheme }`
- [x] 2.2 Update `src/App.jsx` — call `useTheme()` at the top level; pass `toggleTheme` and `theme` as props to `Header`

## 3. Dark Mode — Header Toggle Button

- [x] 3.1 Add `lucide-react` to `package.json` dependencies (for `Sun` and `Moon` icons) if not already present
- [x] 3.2 Update `src/components/Header.jsx` — add a theme toggle `Button` (icon-only, `variant="ghost"`) that shows `Sun` icon in dark mode and `Moon` icon in light mode; calls `toggleTheme` on click

## 4. Dark Mode — Component Audit

- [x] 4.1 Replace hardcoded `bg-white`, `text-gray-900`, `bg-gray-50`, `border-gray-200` etc. in all `src/components/` files with semantic tokens (`bg-background`, `text-foreground`, `bg-card`, `border-border`, `text-muted-foreground`)
- [x] 4.2 Remove any `bg-green-50`, `bg-blue-50`, `bg-red-100` color-background classes from `BestRateSummary`, `RateTable`, `Header`, and `App`

## 5. shadcn Charts — Primitive

- [x] 5.1 Create `src/components/ui/chart.jsx` — manually implement `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, `ChartLegendContent`, and `ChartStyle` following shadcn/ui chart source conventions
- [x] 5.2 Add `chart` entry to `src/index.css` if any chart-specific styles are required

## 6. shadcn Charts — TrendChart Rewrite

- [x] 6.1 Update `src/components/TrendChart.jsx` — define `chartConfig` object mapping each of the 7 sources to `{ label, color }` using CSS variable references
- [x] 6.2 Wrap `<LineChart>` in `<ChartContainer config={chartConfig}>` and remove manual `ResponsiveContainer`
- [x] 6.3 Replace manual `<Tooltip>` with `<ChartTooltip content={<ChartTooltipContent />} />` 
- [x] 6.4 Replace manual `<Legend>` with `<ChartLegend content={<ChartLegendContent />} />` and wire click-to-toggle via `hiddenSources` state

## 7. Period Selector — usePeriod Hook

- [x] 7.1 Add `date-fns` to `package.json` dependencies
- [x] 7.2 Create `src/hooks/usePeriod.js` — reads `?period=`, `?from=`, `?to=` from URL on init; exports `{ startDate, endDate, preset, setPreset, setCustomRange }`; `setPreset("7d")` sets `startDate = today - 7d, endDate = today`; `setPreset("30d")` does same for 30d; writing any value calls `history.replaceState`

## 8. Period Selector — useHistory Refactor

- [x] 8.1 Update `src/hooks/useHistory.js` — accept `{ startDate, endDate }` param; generate list of YYYY-MM-DD strings in range; fetch each `data/history/<date>.json` in parallel; merge results sorted by date

## 9. Period Selector — UI Component

- [x] 9.1 Add `react-day-picker` to `package.json` dependencies
- [x] 9.2 Create `src/components/PeriodSelector.jsx` — renders "7d" and "30d" `Button` presets + a custom range trigger button that opens a `Popover` containing a `DayPicker` range calendar; active preset button shows `ring-2 ring-primary`; custom range trigger shows "From → To" label when active
- [x] 9.3 Update `src/App.jsx` — call `usePeriod()` hook; pass `{ startDate, endDate }` to `useHistory`; render `<PeriodSelector>` inside the Trends `TabsContent` above the chart
- [x] 9.4 Update `src/components/TrendChart.jsx` — accept pre-filtered `history` array (filtering is done in the hook, not the component)

## 10. Dot Indicator Style — BestRateSummary

- [x] 10.1 Update `src/components/BestRateSummary.jsx` — remove `bg-green-50 border-green-200` / `bg-blue-50 border-blue-200` from `SummaryCard`; use `bg-card border-border`; add `<span aria-hidden="true" className="text-green-500">●</span>` before "Best Buy Rate" label and `<span aria-hidden="true" className="text-blue-500">●</span>` before "Best Sell Rate" label

## 11. Dot Indicator Style — RateTable

- [x] 11.1 Update `src/components/RateTable.jsx` — prefix "Best Buy" badge text with `<span aria-hidden="true" className="text-green-500">●</span>` and "Best Sell" with `<span aria-hidden="true" className="text-blue-500">●</span>`; set badge `className` to neutral (`bg-muted text-foreground border-border`)
- [x] 11.2 Update staleness `Alert` in `RateTable` — set `Alert` variant to `default` (neutral bg); add `AlertTriangle` icon with `className="text-yellow-500"` inside `AlertDescription`

## 12. Dot Indicator Style — CurrencySelector

- [x] 12.1 Update `src/components/CurrencySelector.jsx` — selected button: change from filled/default variant to `variant="outline"` + `ring-2 ring-primary`; unselected button: `variant="ghost"`; remove any filled color background from active state

## 13. Verification

- [ ] 13.1 Run `npm run build` and confirm no TypeScript/import errors
- [ ] 13.2 Run `npm run dev`, toggle dark mode, verify all components render correctly in both themes with no bright/dark patches
- [ ] 13.3 Verify period selector: switch 7d ↔ 30d ↔ custom range, confirm URL updates and chart re-renders with filtered data
- [ ] 13.4 Verify dot indicators appear in BestRateSummary, RateTable badges, and CurrencySelector ring with no color backgrounds
