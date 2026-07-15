## Context

FXRScout's dashboard components were built with raw Tailwind utility classes. While functional, this approach produces inconsistent spacing, ad-hoc colour choices, and no built-in accessibility. shadcn/ui is a collection of copy-paste components built on Radix UI primitives with Tailwind — it's not a traditional npm component library but a set of source files that live in `src/components/ui/`. This means full control over the components while getting accessibility, design tokens, and visual consistency for free.

The existing stack (React 19 + Vite + Tailwind CSS v4) is compatible with shadcn/ui.

## Goals / Non-Goals

**Goals:**
- Install shadcn/ui and configure CSS variable design tokens
- Replace ad-hoc Tailwind classes with shadcn/ui components: Card, Table, Badge, Button, Tabs, Skeleton, Alert
- Add `src/lib/utils.js` with `cn()` helper (clsx + tailwind-merge)
- Maintain identical functionality — no feature changes
- Improve visual consistency and accessibility across all dashboard views

**Non-Goals:**
- Dark mode (can be added later via shadcn/ui's built-in theming)
- Replacing Recharts with a shadcn/ui chart library
- Changes to the scraper, data schema, or GitHub Actions workflows
- Adding new dashboard features in this change

## Decisions

### D1: shadcn/ui with Tailwind CSS v4

shadcn/ui officially supports Tailwind v4 via `@shadcn/ui` CLI with the `--css-vars` flag. CSS variables are injected into `index.css` under `:root` and `.dark` selectors, providing the design token system.

**Component mapping:**

| Current | shadcn/ui replacement |
|---|---|
| Custom `<header>` div | `Card` (sticky) |
| Custom pill buttons | `Tabs` / `Button variant="outline"` |
| Custom green/blue cards | `Card`, `CardContent`, `CardHeader` |
| `<table>` with manual classes | `Table`, `TableHeader`, `TableRow`, `TableCell`, `TableHead` |
| Custom span badges | `Badge` variant="secondary" / custom variants |
| `animate-pulse div` skeletons | `Skeleton` |
| Red error div | `Alert`, `AlertDescription` |

### D2: Keep Recharts as-is

shadcn/ui's chart components (built on Recharts) are an option but require significant reconfiguration. The existing `TrendChart.jsx` works well — wrap it in a shadcn `Card` only.

### D3: cn() replaces clsx

shadcn/ui's `cn()` utility (`clsx` + `tailwind-merge`) prevents class conflicts that raw `clsx` can cause with Tailwind. Replace all `clsx` imports with `cn` from `@/lib/utils`.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Tailwind v4 + shadcn/ui compatibility edge cases | Use `npx shadcn@latest init` with `--css-vars` flag; verify output |
| shadcn/ui components copied into `src/components/ui/` increase file count | Expected and by design — these are owned components |
| Existing bespoke styles may conflict with shadcn CSS variables | Audit `index.css` and remove conflicting custom variables after init |
