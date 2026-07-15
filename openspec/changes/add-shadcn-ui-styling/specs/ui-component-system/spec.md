## ADDED Requirements

### Requirement: shadcn/ui component system installed
The project SHALL use shadcn/ui as its UI component system, providing consistent design tokens via CSS variables and accessible Radix UI primitives.

#### Scenario: shadcn/ui initialised
- **WHEN** the project is set up
- **THEN** `src/components/ui/` SHALL contain shadcn/ui component files and `src/lib/utils.js` SHALL export a `cn()` helper

### Requirement: cn() utility used for class merging
All components SHALL use `cn()` from `src/lib/utils.js` (clsx + tailwind-merge) instead of raw `clsx` for conditional class merging.

#### Scenario: Class conflict resolved
- **WHEN** two Tailwind classes conflict (e.g., `p-4` and `p-2`)
- **THEN** `cn()` SHALL resolve the conflict by applying the last class, preventing style bugs

### Requirement: Loading states use Skeleton component
All loading states throughout the dashboard SHALL use the shadcn/ui `Skeleton` component instead of custom `animate-pulse` divs.

#### Scenario: Rate table loading
- **WHEN** `data/latest.json` is being fetched
- **THEN** the rate table area SHALL render `Skeleton` rows matching the expected table structure

### Requirement: Error states use Alert component
All error messages SHALL use the shadcn/ui `Alert` component with `variant="destructive"`.

#### Scenario: Fetch error displayed
- **WHEN** fetching `latest.json` fails
- **THEN** an `Alert` with `AlertDescription` SHALL display the error message

### Requirement: Best rate badges use Badge component
The "Best Buy" and "Best Sell" labels in the rate table SHALL use the shadcn/ui `Badge` component.

#### Scenario: Best buy badge rendered
- **WHEN** a source has the highest buy rate for the selected currency
- **THEN** a `Badge` component SHALL appear next to the source name

### Requirement: Cards used for layout sections
The main dashboard panel, best rate summary cards, and trend chart container SHALL use shadcn/ui `Card`, `CardHeader`, `CardContent` components.

#### Scenario: Best rate summary cards
- **WHEN** the Compare view is displayed
- **THEN** the best buy and best sell summary SHALL each render inside a `Card` component
