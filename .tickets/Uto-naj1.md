---
id: Uto-naj1
status: closed
deps: []
links: []
created: 2026-02-26T23:42:09Z
type: task
priority: 3
tags: [ui, theme, cleanup]
---
# Remove light/dark mode switcher — dark mode only

The site should only use dark mode. Remove all light/dark theme toggle functionality.

## Scope

- Remove the theme toggle button from the UI (index.html)
- Delete or gut js/theme.js — no toggle logic needed
- Remove any light-mode CSS variables or classes from the stylesheet
- Remove the localStorage key used to persist theme preference
- Remove any references to theme switching in ui.js or main.js

## Acceptance Criteria

- The site renders in dark mode only with no toggle button visible
- No theme-related JavaScript runs on page load (or it is deleted entirely)
- No light-mode CSS rules remain in the stylesheet
- All existing parser tests continue to pass

