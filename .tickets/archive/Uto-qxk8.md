---
id: Uto-qxk8
status: closed
deps: []
links: []
created: 2026-02-25T03:21:23Z
type: bug
priority: 1
tags: [ui, advanced-settings]
---
# Advanced settings content always visible — should be collapsed by default

The Advanced Settings panel content (`#adv-content`) is always shown when the panel appears after a parse, instead of being collapsed until the user clicks the toggle button.

## Root cause

The HTML `hidden` attribute relies on the browser's default stylesheet setting `display: none`. The CSS rule `#adv-content { display: grid; }` has higher specificity than the browser default, so it overrides `hidden` and the content is always rendered visibly regardless of the attribute's presence.

## Fix

Add `#adv-content[hidden] { display: none; }` to `css/main.css` so the explicit `[hidden]` selector wins over the general `#adv-content` rule. No JS changes are needed — the existing toggle logic (adding/removing the `hidden` attribute) is correct.

## Acceptance Criteria

- After a successful parse, the Advanced Settings toggle button appears but the content area is collapsed.
- Clicking the toggle expands the content and rotates the arrow icon.
- Clicking again collapses it.
- Clearing the input hides the panel entirely (existing behaviour preserved).
