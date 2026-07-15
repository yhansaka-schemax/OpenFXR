## 1. Setup shadcn/ui

- [x] 1.1 Install shadcn/ui dependencies: `npx shadcn@latest init` — accept defaults, choose CSS variables theme, Tailwind CSS v4
- [x] 1.2 Verify `src/lib/utils.js` was created with `cn()` helper; if not, create manually: `import { clsx } from 'clsx'; import { twMerge } from 'tailwind-merge'; export function cn(...inputs) { return twMerge(clsx(inputs)); }`
- [x] 1.3 Install `tailwind-merge` if not already present: `npm install tailwind-merge`
- [x] 1.4 Add required shadcn/ui components: `npx shadcn@latest add card badge button tabs table skeleton alert tooltip`
- [x] 1.5 Verify `src/components/ui/` contains: `card.jsx`, `badge.jsx`, `button.jsx`, `tabs.jsx`, `table.jsx`, `skeleton.jsx`, `alert.jsx`
- [x] 1.6 Replace all `import clsx from 'clsx'` with `import { cn } from '@/lib/utils'` across all components in `src/components/`
- [x] 1.7 Configure Vite path alias `@` → `src/` in `vite.config.js` so `@/lib/utils` resolves correctly

## 2. Update Header

- [x] 2.1 Refactor `src/components/Header.jsx` — wrap in a sticky `div` with shadcn styling; use `Badge` for the 🇱🇰 Sri Lanka label; replace loading text with `Skeleton` when data is loading

## 3. Update CurrencySelector

- [x] 3.1 Refactor `src/components/CurrencySelector.jsx` — replace custom pill buttons with shadcn `Button variant="outline"` / `variant="default"` for selected state; use `cn()` for conditional classes

## 4. Update BestRateSummary

- [x] 4.1 Refactor `src/components/BestRateSummary.jsx` — replace custom green/blue divs with shadcn `Card` + `CardContent`; use `Skeleton` for loading state when sources is null

## 5. Update RateTable

- [x] 5.1 Refactor `src/components/RateTable.jsx` — replace `<table>` with shadcn `Table`, `TableHeader`, `TableRow`, `TableHead`, `TableBody`, `TableCell` components
- [x] 5.2 Replace custom badge `<span>` elements with shadcn `Badge` component for "Best Buy" and "Best Sell"
- [x] 5.3 Replace the manual `animate-pulse` skeleton divs with shadcn `Skeleton` components
- [x] 5.4 Replace the custom CBSL staleness warning `<div>` with shadcn `Alert` + `AlertDescription`

## 6. Update TrendChart

- [x] 6.1 Wrap `src/components/TrendChart.jsx` content in a shadcn `Card` + `CardContent`
- [x] 6.2 Replace the `animate-pulse` loading skeleton with shadcn `Skeleton`
- [x] 6.3 Replace the "Not enough history yet" custom div with a styled empty state inside a `Card`

## 7. Update App layout

- [x] 7.1 Refactor `src/App.jsx` view tabs (Compare/Trends) to use shadcn `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- [x] 7.2 Replace the error `<div>` with shadcn `Alert variant="destructive"` + `AlertDescription`
- [x] 7.3 Wrap the main dashboard panel in a shadcn `Card`

## 8. Clean up

- [x] 8.1 Remove `clsx` from `package.json` dependencies if fully replaced by `cn()` (check no remaining usages) — kept: `clsx` is used by `cn()`
- [x] 8.2 Audit `src/index.css` — remove any conflicting custom CSS variables that clash with shadcn/ui's generated CSS variables
- [ ] 8.3 Run `npm run build` to verify no import errors or build failures
- [ ] 8.4 Run `npm run dev` and verify the dashboard renders correctly in the browser
