---
id: Uto-t8zl
status: closed
deps: []
links: []
created: 2026-03-08T12:45:22Z
type: task
priority: 2
assignee: Jamie Walls
---
# Add tooltip hints to Advanced Settings options

Add a small '?' icon after each Advanced Settings option label that shows a descriptive tooltip on hover and keyboard focus. Tooltips should be custom-styled to match the dark theme (not browser-native title attributes), appear above/below the icon, and be dismissible. Each parser mode's options should have concise copy explaining what the toggle does.

## Design

Render a <span class='adv-hint'> element after each checkbox label in the Advanced Settings panel. On :hover and :focus-within, show a positioned tooltip with the help text. Use tabindex='0' on the hint icon so keyboard users can access it. Style with CSS only — no JS needed. Tooltip text is defined alongside each option in the settings renderer in ui.js.

## Acceptance Criteria

- Every toggle in Kingdom News, Province Logs, and Province News Advanced Settings has a '?' hint icon
- Hovering or focusing the icon shows a readable tooltip in the site's dark theme
- Tooltip is keyboard accessible (tab to icon, tooltip appears)
- No tooltip text is missing or placeholder
- No regressions to existing settings behavior

