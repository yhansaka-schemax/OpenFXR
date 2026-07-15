## ADDED Requirements

### Requirement: Currency tab selector
The dashboard SHALL provide a currency selector allowing users to switch between all supported currencies (USD, GBP, EUR, AED, SAR, INR, SGD, CAD, AUD, JPY, CNY, MYR). The selected currency SHALL persist in the URL query string.

#### Scenario: Currency switched
- **WHEN** the user selects a different currency
- **THEN** the comparison table, best-rate summary, and trend chart SHALL update to show rates for the selected currency, and the URL SHALL update to `?currency=USD` (or selected code)

#### Scenario: Currency from URL on load
- **WHEN** the user opens the dashboard with a `?currency=GBP` query parameter
- **THEN** GBP SHALL be pre-selected and all views SHALL render for GBP without requiring user interaction

#### Scenario: Default currency
- **WHEN** no currency is specified in the URL
- **THEN** USD SHALL be selected by default

### Requirement: Unavailable currency indication
The currency selector SHALL visually indicate currencies for which no source currently has rate data.

#### Scenario: Currency with no data
- **WHEN** a currency has all-null rates across all sources in `latest.json`
- **THEN** that currency's tab/button SHALL be greyed out but still selectable, showing "No data available" when selected
