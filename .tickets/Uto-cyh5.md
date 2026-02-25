---
id: Uto-cyh5
status: in_progress
deps: []
links: []
created: 2026-02-24T22:35:08Z
type: epic
priority: 1
tags: [ui, advanced-settings]
---
# Advanced Parser Settings - Collapsible panel UI

Create the Advanced Parser Settings UI component. Per requirements: only appears after parsing some text, minimized (collapsed) by default, and dynamically changes its contents based on which mode was parsed (Kingdom News, Province Logs, or Province News).

This is the scaffolding epic for all Advanced Settings work. Individual option sets for each mode are child tickets.

## Acceptance Criteria

- Panel is hidden before any parse has occurred
- Panel appears collapsed after first successful parse
- Panel expand/collapse toggle works
- Panel content area is dynamic (placeholder for mode-specific controls)
- Works on mobile (touch-friendly toggle)

