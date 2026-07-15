## ADDED Requirements

### Requirement: Rate comparison table
The dashboard SHALL display a table comparing buy and sell rates for the selected currency across all sources that have data, sorted by best buy rate descending.

#### Scenario: Table renders with latest data
- **WHEN** the user opens the dashboard
- **THEN** the rate comparison table SHALL fetch `data/latest.json` and display one row per source with columns: Source, Buy Rate, Sell Rate, Spread (buy vs CBSL), Last Updated

#### Scenario: Missing rate shown as N/A
- **WHEN** a source does not publish a rate for the selected currency
- **THEN** that source's buy/sell cell SHALL display "N/A" rather than zero or blank

### Requirement: Spread calculation vs CBSL
The system SHALL calculate and display the spread percentage of each bank's buy rate relative to the CBSL mid-rate for the selected currency.

#### Scenario: Spread displayed
- **WHEN** both a bank buy rate and CBSL mid-rate are available
- **THEN** the spread SHALL be calculated as `((bank_buy - cbsl_mid) / cbsl_mid) * 100` and displayed as a percentage with sign (e.g., `-0.47%`)

#### Scenario: CBSL rate unavailable
- **WHEN** the CBSL rate is null or stale (older than 48 hours)
- **THEN** spread column SHALL display "—" and a staleness warning SHALL appear near the CBSL row

### Requirement: Last updated timestamp
The dashboard SHALL display the timestamp of the most recent data collection run prominently near the top of the page.

#### Scenario: Timestamp displayed
- **WHEN** the dashboard loads `latest.json`
- **THEN** the `updated` field SHALL be formatted and displayed as a human-readable relative time (e.g., "Updated 2 hours ago") in the user's local timezone
