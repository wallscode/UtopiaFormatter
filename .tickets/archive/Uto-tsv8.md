---
id: Uto-tsv8
status: closed
deps: []
links: []
created: 2026-02-28T12:18:24Z
type: bug
priority: 1
tags: [ui, clear-button]
assignee: Jamie Walls
---
# Bug: Clear button hides output textarea permanently

## Behavior

Clicking the Clear button (or pressing Escape) makes the output textarea disappear. The only way to restore it is to refresh the page.

## Root cause

`handleClear` in `js/ui.js` calls `hideMessage(elements.outputText)` on the output `<textarea>`. `hideMessage` sets `element.className = 'feedback hidden'` — it is designed for feedback `<div>` elements, not the textarea. Applying it to the textarea overwrites its class list and adds the `hidden` CSS class, which hides the element. No subsequent code path removes `hidden` from the textarea, so it stays invisible until page reload.

## Fix

Remove the `hideMessage(elements.outputText)` call from `handleClear`. The textarea value is already cleared by `elements.outputText.value = ''` on the line above. The output box should remain visible and simply show its placeholder text.

The Clear button should only clear the contents of the input textarea. The output box should stay visible and empty after clearing.
