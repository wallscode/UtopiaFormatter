---
id: Uto-ox6f
status: closed
deps: []
links: []
created: 2026-03-08T12:45:46Z
type: task
priority: 2
assignee: Jamie Walls
---
# Add tooltip hints to Advanced Settings options

Add a small '?' icon after each Advanced Settings option label that shows a descriptive tooltip on hover and keyboard focus. Tooltips should be custom-styled to match the dark theme (not browser-native title attributes), and be fully accessible on desktop, keyboard, and mobile touch.

Mobile: on touch devices (pointer: coarse), hover is unavailable. The '?' icon must be tappable to toggle the tooltip open/closed. A tap outside or on the icon again dismisses it. This requires a small JS toggle since CSS :hover does not fire on touch.

ADA/WCAG compliance:
- role='tooltip' on the tooltip element (WCAG 1.3.1)
- aria-describedby linking the icon to its tooltip id (WCAG 1.3.1)
- tabindex='0' on the icon so keyboard users can reach it (WCAG 2.1.1)
- Tooltip appears on :focus as well as :hover (WCAG 2.1.1)
- Tooltip text has sufficient colour contrast against the dark background (WCAG 1.4.3, min 4.5:1)
- Tooltip does not disappear while the user is reading it (WCAG 1.4.13 — content on hover/focus must be persistent, dismissible, hoverable)
- Tooltip is dismissible via Escape key (WCAG 1.4.13)
- Icon has an aria-label (e.g. 'More information') so screen readers announce it meaningfully (WCAG 4.1.2)

## Design

Render a <button class='adv-hint' aria-label='More information' aria-describedby='hint-[id]'> after each checkbox label. The tooltip is a sibling <span role='tooltip' id='hint-[id]'> positioned via CSS. On desktop: shown via CSS :hover + :focus-visible. On touch (pointer: coarse): a JS click handler toggles an 'is-open' class; a document click listener dismisses it; Escape key also dismisses. Tooltip text defined inline with each option in the settings renderer in ui.js.

## Acceptance Criteria

- Every toggle in Kingdom News, Province Logs, and Province News Advanced Settings has a '?' hint icon
- Hovering or focusing the icon shows a readable tooltip in the site's dark theme
- Tapping the icon on mobile toggles the tooltip; tapping outside dismisses it
- Escape key dismisses an open tooltip
- Tooltip is keyboard accessible (tab to icon, tooltip appears on focus)
- role='tooltip' and aria-describedby wiring is correct
- Tooltip text contrast meets WCAG 1.4.3 (4.5:1 minimum)
- Tooltip remains visible while the pointer is over it (WCAG 1.4.13)
- No tooltip text is missing or placeholder
- No regressions to existing settings behavior

