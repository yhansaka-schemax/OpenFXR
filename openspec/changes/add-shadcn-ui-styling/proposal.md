## Why

The current dashboard uses raw Tailwind utility classes throughout components, making it inconsistent and harder to maintain. Migrating to shadcn/ui gives FXRScout a polished, accessible component system built on Radix UI primitives — consistent design tokens, proper keyboard navigation, and a professional look without additional design work.

## What Changes

- Install and configure shadcn/ui (Radix UI + class-variance-authority + tailwind-merge)
- Replace custom-styled elements with shadcn/ui components: Button, Card, Badge, Table, Tabs, Skeleton, Alert, Tooltip
- Update all dashboard components (Header, CurrencySelector, BestRateSummary, RateTable, TrendChart) to use shadcn/ui primitives
- Update Tailwind CSS config to support shadcn/ui CSS variable design tokens (CSS variables for colors, radius, etc.)
- Replace `clsx` usage with `cn()` utility from shadcn/ui (`clsx` + `tailwind-merge`)

## Capabilities

### New Capabilities

### Modified Capabilities

- `rate-comparison`: Visual presentation of the rate table uses shadcn Table, Badge components — same functional requirements, refined visual design
- `best-rate-highlight`: Best Buy / Best Sell badges use shadcn Badge component
- `rate-trends`: Chart container uses shadcn Card; loading state uses shadcn Skeleton
- `currency-selector`: Currency tabs use shadcn Tabs component
- `rate-collection`: No change

## Impact

- New dependencies: `shadcn/ui` CLI setup, `@radix-ui/*` packages, `class-variance-authority`, `tailwind-merge`, `lucide-react`
- `tailwind.config.js` (or CSS) updated with shadcn/ui CSS variable theme
- `src/lib/utils.js` added with `cn()` helper
- All `src/components/*.jsx` files updated to use shadcn primitives
- `clsx` import replaced by `cn()` throughout
- No scraper changes, no data schema changes, no workflow changes
