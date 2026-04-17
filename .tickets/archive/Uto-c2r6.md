---
id: Uto-c2r6
status: closed
deps: []
links: []
created: 2026-03-09T19:46:20Z
type: task
priority: 2
assignee: Jamie Walls
---
# Make enhanced view the default output display

Replace the visible textarea with the enhanced view as the primary output display. The textarea stays in the DOM (hidden) as the clipboard source for all copy buttons. Move Advanced Settings below the output section. Add a 'Show raw text' toggle in Advanced Settings that unhides the textarea for power users.

This is the foundation ticket — all other UI refactor tickets depend on this.

## Design

## Key changes

### Remove textarea from visible flow
- Add `hidden` class to the output textarea by default after parsing
- Enhanced view div becomes the primary visible output (no longer behind a toggle)
- Remove the 'Enhanced View' toggle from Advanced Settings
- Add a 'Show raw text' toggle in its place (default off) — when on, shows the textarea below the enhanced view

### Move Advanced Settings
- Move the Advanced Settings section from below the input (left-col) to below the output section
- On desktop: full-width below the output column
- On mobile: full-width below the output, collapsed by default
- Stays collapsed by default, visible as a clickable bar so users know it exists

### Remove output box constraints
- Remove max-height and overflow-y from the enhanced output container
- Let cards flow naturally in the page (page scrolls, not the container)
- Remove the border/background that makes it look like a constrained box

### Copy buttons
- Keep copy buttons in their current position relative to the output area
- They continue reading from the hidden textarea — zero changes to copy logic

## Implementation notes
- The `advSettings.*.enhancedView` keys become unnecessary (always true) — remove them
- The `renderEnhancedViewToggle` function is replaced by `renderRawTextToggle`
- `updateEnhancedView` logic inverts: enhanced is always shown unless 'Show raw text' is active

## Acceptance Criteria

- After parsing, enhanced view cards are the visible output (no textarea visible)
- No max-height scroll container — cards flow naturally with page scroll
- Advanced Settings section appears below the output, collapsed by default
- 'Show raw text' toggle in Advanced Settings shows/hides the textarea
- All three copy buttons work identically to current behavior
- Enhanced view updates on every re-parse and settings change
- Clear button resets everything including hiding the enhanced output

