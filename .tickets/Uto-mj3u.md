---
id: Uto-mj3u
status: open
deps: []
links: []
created: 2026-03-06T16:48:26Z
type: task
priority: 2
assignee: Jamie Walls
---
# Advanced Settings: contextual toggle to reveal optional second input for combined province summary

When a user pastes Province News or Province Logs, Advanced Settings should show a toggle that lets them optionally reveal a second input box to paste the complementary data type. If both inputs contain data, the combined province summary mode (specified in Uto-of2a) activates automatically.

This ticket covers only the UI toggle and second input box visibility. The combined output format and parser changes are specified in Uto-of2a.

## Behaviour

**Province News pasted:**
A toggle appears in Advanced Settings labelled:
  'Show input box to add Province Logs (appended to summary)'
Default: off. When turned on, a second textarea appears below the main input, labelled 'Province Logs (optional)'.

**Province Logs pasted:**
A toggle appears in Advanced Settings labelled:
  'Show input box to add Province News (appended to summary)'
Default: off. When turned on, a second textarea appears below the main input, labelled 'Province News (optional)'.

**Kingdom News pasted:**
No toggle appears. This feature is Province-only.

**Toggle turned off after content was entered in the second box:**
The second textarea is hidden but its content is preserved in memory so re-enabling the toggle restores what was typed. The combined output reverts to single-parser output while the second box is hidden.

## UI placement

The toggle appears at the top of the Advanced Settings panel, above the Sections group, so it is easy to find regardless of scroll position. It is only rendered when the detected input type is Province News or Province Logs — it is not present otherwise.

## Second textarea

The second textarea matches the styling and sizing of the primary input textarea. It has a clear label ('Province Logs (optional)' or 'Province News (optional)') and placeholder text describing what to paste. It appears directly below the primary input, above the output textarea.

## Detect badge

When both inputs contain valid parseable data the detect badge updates to show 'Province Logs + Province News' consistent with the design in Uto-of2a.

## Acceptance Criteria

- Pasting Province News shows a toggle in Advanced Settings for adding Province Logs input, and vice versa
- Toggle is off by default; turning it on reveals the second textarea
- Turning the toggle off hides the second textarea but preserves its content
- Second textarea is absent for Kingdom News input
- When both inputs have content the output switches to combined province summary mode (Uto-of2a)
- When only one input has content the output is the standard single-parser output
- All existing tests pass

