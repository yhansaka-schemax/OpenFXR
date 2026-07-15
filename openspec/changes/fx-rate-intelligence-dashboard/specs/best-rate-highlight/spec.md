## ADDED Requirements

### Requirement: Best buy rate badge
The dashboard SHALL visually identify the source offering the highest buy rate for the selected currency using a badge or highlight on the comparison table row.

#### Scenario: Best buy highlighted
- **WHEN** the comparison table is rendered with at least two sources having valid buy rates
- **THEN** the row with the highest buy rate SHALL display a "Best Buy" badge

#### Scenario: Tie handling
- **WHEN** two or more sources share the highest buy rate
- **THEN** all tied sources SHALL display the "Best Buy" badge

### Requirement: Best sell rate badge
The dashboard SHALL visually identify the source offering the lowest sell rate (cheapest to buy foreign currency) for the selected currency.

#### Scenario: Best sell highlighted
- **WHEN** the comparison table is rendered with at least two sources having valid sell rates
- **THEN** the row with the lowest sell rate SHALL display a "Best Sell" badge

### Requirement: Best rate summary card
The dashboard SHALL display a summary card above the table showing the best buy source and rate, and the best sell source and rate for the selected currency at a glance.

#### Scenario: Summary card displayed
- **WHEN** the dashboard loads and valid rate data is present
- **THEN** a summary card SHALL show: "Best Buy: [Bank] @ [rate]" and "Best Sell: [Bank] @ [rate]"

#### Scenario: No valid rates available
- **WHEN** all sources return null for the selected currency
- **THEN** the summary card SHALL display "No rates available for [currency]"
