---
id: Uto-xcbo
status: closed
deps: []
links: []
created: 2026-02-24T22:34:58Z
type: feature
priority: 1
tags: [ui, parser]
---
# Auto-detect input type from pasted text

Replace manual mode radio buttons with automatic detection of input type when text is pasted. The parser should inspect the pasted text and silently select the correct mode before parsing.

Detection signals (from requirements):
- Kingdom News: presence of attack verbs (captured, invaded, recaptured, razed, ambushed, killed, pillaged, attempted an invasion)
- Province Logs: phrases like 'Early indications show that our operation', 'Your wizards gather', 'You have ordered', 'You have given orders to commence work'

## Acceptance Criteria

- Pasting Kingdom News text auto-selects Kingdom News mode
- Pasting Province Logs text auto-selects Province Logs mode
- A visible indicator shows which mode was auto-detected
- Manual override of detected mode still works
- Unknown input falls back gracefully with a clear message

