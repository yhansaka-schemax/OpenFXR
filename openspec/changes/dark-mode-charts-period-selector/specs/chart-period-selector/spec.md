## ADDED Requirements

### Requirement: Preset period buttons control chart data range
The Trends tab SHALL display period preset buttons — "7d" and "30d" — that filter the history snapshots shown in the chart to the selected number of most-recent days.

#### Scenario: Select 7-day preset
- **WHEN** user clicks the "7d" button
- **THEN** the chart renders only snapshots from the last 7 calendar days, and the button appears in active/selected state

#### Scenario: Select 30-day preset (default)
- **WHEN** the Trends tab is first opened with no URL period param
- **THEN** the "30d" preset is selected by default and the chart shows up to 30 days of history

### Requirement: Custom date range picker allows arbitrary period selection
The Trends tab SHALL provide a custom date-range input (calendar picker) that lets users specify a start and end date; the chart SHALL update to display only snapshots within that range.

#### Scenario: User picks a valid custom range
- **WHEN** user selects a start date and end date from the picker
- **THEN** no preset button is highlighted, the chart renders snapshots within that inclusive date range, and the selected range is shown in the picker trigger

#### Scenario: User picks a start date after end date
- **WHEN** user selects a start date that is after the current end date
- **THEN** the end date is reset and the user must pick a new end date before the filter applies

#### Scenario: Custom range with no data
- **WHEN** the selected date range contains no history snapshots
- **THEN** the chart displays the empty-state ("Not enough data for this period") message instead of a blank chart

### Requirement: Period selection is URL-synced
The active period SHALL be reflected in the URL query string so that sharing or refreshing the URL restores the same period view.

#### Scenario: Preset period in URL
- **WHEN** URL contains `?period=7d`
- **THEN** the 7d preset is selected on load

#### Scenario: Custom range in URL
- **WHEN** URL contains `?from=2025-01-01&to=2025-01-14`
- **THEN** the custom date picker shows that range on load and the chart renders accordingly

#### Scenario: Changing period updates URL
- **WHEN** user changes the period selection
- **THEN** the URL is updated via `history.replaceState` without a page reload
