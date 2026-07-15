## ADDED Requirements

### Requirement: Historical trend chart
The dashboard SHALL display a line chart showing buy/sell rate history over time for the selected currency and a user-selected set of sources, using accumulated daily JSON history files.

#### Scenario: Chart renders on history tab
- **WHEN** the user navigates to the trends/history view
- **THEN** the dashboard SHALL fetch the last 30 days of `data/history/YYYY-MM-DD.json` files and render a multi-line chart with one line per source using Recharts

#### Scenario: Insufficient history
- **WHEN** fewer than 3 days of history exist
- **THEN** the chart SHALL display a message "Not enough history yet — check back soon" instead of an empty chart

#### Scenario: Source toggling on chart
- **WHEN** the user clicks a source legend item
- **THEN** that source's line SHALL be toggled visible/hidden on the chart

### Requirement: CBSL reference line on chart
The historical chart SHALL include the CBSL mid-rate as a distinct reference line to visualise spread over time.

#### Scenario: CBSL line rendered
- **WHEN** CBSL history data is available
- **THEN** the CBSL line SHALL be rendered as a dashed line in a distinct colour, labelled "CBSL (official)"

### Requirement: Lazy history loading
The dashboard SHALL load history data only when the user navigates to the trends view, not on initial page load.

#### Scenario: History not fetched on load
- **WHEN** the user opens the dashboard on the comparison view
- **THEN** no `data/history/*.json` requests SHALL be made until the user opens the trends view
