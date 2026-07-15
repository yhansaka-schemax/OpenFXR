## ADDED Requirements

### Requirement: Semantic color is conveyed by dot or icon only, not background
No component SHALL use a color-filled background (e.g., `bg-green-50`, `bg-blue-50`, `bg-red-100`) to convey meaning. Color SHALL appear only on a `●` dot character (`text-[color]`) prefixed to the label, or on a small inline icon element. All card and badge backgrounds SHALL use neutral tokens (`bg-card`, `bg-muted`, or `bg-background`).

#### Scenario: BestRateSummary cards — no color background
- **WHEN** BestRateSummary renders the "Best Buy Rate" and "Best Sell Rate" cards
- **THEN** both cards use `bg-card` background; a green `●` precedes "Best Buy Rate" and a blue `●` precedes "Best Sell Rate"

#### Scenario: RateTable badges — neutral background
- **WHEN** RateTable renders "Best Buy" and "Best Sell" badges
- **THEN** the badge background is neutral (`bg-muted` or outlined); a green or blue `●` dot is displayed before the label text

#### Scenario: Alert/warning indicators — icon carries the color
- **WHEN** a staleness warning Alert is shown
- **THEN** the Alert background is `bg-muted` or `bg-card`; only the warning icon (⚠ or `AlertTriangle`) is colored (e.g., `text-yellow-500`)

### Requirement: Dot indicators are accessible
The colored dot SHALL use `aria-hidden="true"` and the label text SHALL stand alone as the accessible name so screen readers are not confused by the decorative character.

#### Scenario: Dot is decorative
- **WHEN** a colored dot `●` is rendered
- **THEN** it carries `aria-hidden="true"` on its wrapping `<span>`

### Requirement: CurrencySelector active state uses border/ring, not background fill
The selected currency button SHALL indicate selection with a colored border or ring, not a filled background color.

#### Scenario: Selected currency button
- **WHEN** a currency button is in the selected state
- **THEN** it has a visible ring/border accent (e.g., `ring-2 ring-primary`) and uses `bg-card` or `bg-background`, not a filled color

#### Scenario: Unselected currency button
- **WHEN** a currency button is not selected
- **THEN** it renders as `variant="outline"` or `variant="ghost"` with no fill
