---
id: Uto-3tu6
status: closed
deps: []
links: []
created: 2026-03-09T22:11:06Z
type: task
priority: 2
assignee: Jamie Walls
---
# Remove Dashboard and Compact Table views, default to Clean Cards

Check to make sure that the Dashboard and Compact Table view options are removed from the UI entirely. Set Clean Cards view as the default and only view option.

## Design

Verify that Dashboard and Compact Table view options are removed from the UI. If not, update necessary UI files to remove Dashboard and Compact Table view rendering logic and UI controls. Set Clean Cards as the default view mode. Remove any view-switching UI elements and related event handlers.

## Acceptance Criteria

Only Clean Cards view is available in the UI. No view-switching controls are present. Clean Cards view loads by default.

