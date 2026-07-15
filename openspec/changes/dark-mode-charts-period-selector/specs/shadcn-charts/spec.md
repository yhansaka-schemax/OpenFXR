## ADDED Requirements

### Requirement: TrendChart uses shadcn ChartContainer
The `TrendChart` component SHALL be rewritten to use `ChartContainer` from `@/components/ui/chart` with a `chartConfig` object that maps each source name to a label and a CSS-variable color token.

#### Scenario: Chart renders with shadcn container
- **WHEN** the Trends tab is active and history data is loaded
- **THEN** the chart renders inside a `ChartContainer` with proper aria-label and responsive sizing

#### Scenario: chartConfig defines all sources
- **WHEN** the chart is initialized
- **THEN** `chartConfig` contains entries for all 7 sources: CBSL, Market, BOC, People's, Commercial, HNB, Sampath — each with a `label` and `color` CSS variable

### Requirement: Chart tooltip uses ChartTooltipContent
The chart tooltip SHALL use `ChartTooltipContent` from `@/components/ui/chart` so that it inherits the current theme (light/dark) automatically.

#### Scenario: Tooltip in dark mode
- **WHEN** dark mode is active and user hovers a data point
- **THEN** the tooltip renders with dark background and light text without any additional override

#### Scenario: Tooltip shows formatted values
- **WHEN** tooltip is triggered
- **THEN** each visible source shows its name (from `chartConfig` label) and the rate value formatted to 2 decimal places, or "N/A" if null

### Requirement: Chart legend uses ChartLegendContent
The chart legend SHALL use `ChartLegendContent` and display source labels from `chartConfig`; clicking a legend item SHALL toggle that line's visibility.

#### Scenario: Legend click hides a source
- **WHEN** user clicks a legend item
- **THEN** the corresponding line is hidden from the chart and the legend item appears visually muted

#### Scenario: Legend click re-shows a source
- **WHEN** user clicks a hidden legend item
- **THEN** the corresponding line reappears in the chart

### Requirement: Chart colors use CSS variable tokens
Each source line SHALL use a color defined as a CSS variable (e.g., `--color-boc: hsl(...)`) in `:root` / `.dark` blocks, so colors adapt to dark mode.

#### Scenario: Colors adapt to dark mode
- **WHEN** user toggles to dark mode
- **THEN** chart line colors update to their dark-mode CSS variable values without a page reload
