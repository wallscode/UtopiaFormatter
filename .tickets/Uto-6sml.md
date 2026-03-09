---
id: Uto-6sml
status: closed
deps: []
links: []
created: 2026-03-09T19:47:25Z
type: task
priority: 2
assignee: Jamie Walls
---
# Single-column layout option with temporary toggle

Add a temporary toggle in Advanced Settings to switch between the current two-column desktop layout and a single-column layout where the output flows below the input at full width. This lets the user compare both layouts before committing to one. The toggle and the unchosen layout should be easy to remove from the codebase once a decision is made. Depends on Uto-c2r6.

## Design

## Two-column (current)
- Input in left column, output in right column
- Advanced Settings below input in left column (moving below output per Uto-c2r6)

## Single-column (new option)
- Full-width stacked layout: Input → Output → Advanced Settings
- Cards in the output section can breathe — no narrow right-column constraint
- On desktop, cards can optionally use a 2-column CSS grid within the output for data-dense sections (e.g. two stat cards side by side)
- On mobile, identical to current mobile flow (already single-column)

## Toggle
- Temporary toggle in Advanced Settings: 'Single-column layout'
- Stored in advSettings (not per-mode — applies globally)
- When active, CSS class on `main.container` switches from grid/flex two-col to single-col
- Default: off (two-column, current behavior)

## Cleanup
- Toggle, CSS class, and advSettings key clearly named (e.g. `singleColumnLayout`) so removal is a simple grep-and-delete

## Acceptance Criteria

- Toggle in Advanced Settings switches between two-column and single-column layout
- Single-column: input full-width, then output full-width below, then Advanced Settings
- Two-column: current layout preserved
- Mobile layout unchanged (already single-column)
- Toggle is easy to find and remove once a decision is made

