## ADDED Requirements

### Requirement: System respects OS color scheme preference on first load
The app SHALL read `prefers-color-scheme` on initial mount and apply `dark` class to `<html>` when the user's OS is set to dark mode, unless a stored preference exists.

#### Scenario: First visit on dark-OS system
- **WHEN** no `theme` key exists in `localStorage` AND OS preference is dark
- **THEN** the `dark` class is added to `<html>` on mount and the app renders in dark mode

#### Scenario: First visit on light-OS system
- **WHEN** no `theme` key exists in `localStorage` AND OS preference is light
- **THEN** the `dark` class is absent from `<html>` and the app renders in light mode

### Requirement: User can manually toggle theme
The app SHALL provide a theme toggle button in the Header that switches between light and dark modes and persists the choice to `localStorage` under key `"fxrscout-theme"`.

#### Scenario: Toggle to dark mode
- **WHEN** user clicks the theme toggle button while in light mode
- **THEN** the `dark` class is added to `<html>`, the button icon changes to a sun icon, and `"fxrscout-theme": "dark"` is saved to `localStorage`

#### Scenario: Toggle to light mode
- **WHEN** user clicks the theme toggle button while in dark mode
- **THEN** the `dark` class is removed from `<html>`, the button icon changes to a moon icon, and `"fxrscout-theme": "light"` is saved to `localStorage`

### Requirement: Stored preference overrides OS preference on return visit
The app SHALL read `localStorage` before checking `prefers-color-scheme`; a stored value SHALL take precedence.

#### Scenario: Stored dark preference on light-OS return visit
- **WHEN** `localStorage["fxrscout-theme"]` is `"dark"` and OS is light
- **THEN** app renders in dark mode on load

#### Scenario: Stored light preference on dark-OS return visit
- **WHEN** `localStorage["fxrscout-theme"]` is `"light"` and OS is dark
- **THEN** app renders in light mode on load

### Requirement: All UI surfaces use dark-mode-aware tokens
Every component SHALL use only Tailwind `dark:` variants or shadcn CSS-variable-based classes (e.g., `bg-background`, `text-foreground`, `border-border`) so that dark mode is applied without per-component color overrides.

#### Scenario: Dark mode active — no hardcoded light colors visible
- **WHEN** dark mode is active
- **THEN** no component renders a hardcoded `bg-white` or `text-gray-900` that appears as a bright patch

#### Scenario: Light mode active — no dark patches
- **WHEN** light mode is active
- **THEN** no component renders a hardcoded `bg-gray-900` or `text-white` that appears as a dark patch
