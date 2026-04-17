---
id: Uto-tna4
status: closed
deps: []
links: []
created: 2026-03-09T22:11:24Z
type: task
priority: 2
assignee: Jamie Walls
---
# Remove 'from UtopiaFormatter.com' from UI titles, retain in clipboard output

In Clean Cards view titles for Kingdom News Report, Province Logs Report, and Province News Report, remove the 'from UtopiaFormatter.com' text from the displayed UI. However, ensure 'from UtopiaFormatter.com' is retained in the raw text output used by all Copy to Clipboard functionality.

## Design

Update ui.js to modify the title rendering for Clean Cards view to exclude 'from UtopiaFormatter.com' from the displayed HTML. Ensure parser.js raw text output retains 'from UtopiaFormatter.com' so clipboard operations include it. Verify all copy button implementations preserve the full text including the attribution.

## Acceptance Criteria

Clean Cards view titles show report names without 'from UtopiaFormatter.com'. All Copy to Clipboard operations include 'from UtopiaFormatter.com' in the copied text.

