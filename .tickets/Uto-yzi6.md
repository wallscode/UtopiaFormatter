---
id: Uto-yzi6
status: closed
deps: []
links: []
created: 2026-03-09T22:10:58Z
type: task
priority: 2
assignee: Jamie Walls
---
# Add space after colon in Kingdom News and Province News outputs

In the UI Cards view, the Own Kingdom Summary report in Kingdom News, and Thievery Impacts and Spell Impacts sections in Province News are showing key:value with no space after the colon. Example: 'Incite Riots:4 occurrences, 34 days' should be 'Incite Riots: 4 occurrences, 34 days'. This affects only the UI display and is not a problem in the raw text output.

## Design

**Root cause (rendering layer):** The KV detection regex in `renderSectionLines` and `renderKnBlockLines` uses a lazy quantifier (`^(.+?):\s+(.+)$`). For lines that contain a colon inside a parenthetical (e.g. province source lines like `Province Name (3:7): 83 acres` or attack lines like `An unknown province from Odd-lympics (3:7): 56 acres`), the lazy regex matches at the *first* colon — splitting the key incorrectly as `Province Name (3` and the value as `7): 56 acres`. This causes the display to show `Province Name (3: 7): 56 acres` rather than the intended `Province Name (3:7): 56 acres`.

**Raw text output:** The parser already generates correct `Key: Value` spacing (with space) for all lines in Own Kingdom Summary, Thievery Impacts, and Spell Impacts. No parser changes needed.

**Fix (rendering layer only):**
- In `renderSectionLines` (Province Logs / Province News / Combined cards): change the KV regex from lazy `^(.+?):\s+(.+)$` to greedy `^(.+):\s+(.+)$`. The greedy version matches at the *last* colon followed by a space, correctly identifying the separator between key and value even when the key contains kingdom references like `(3:7)`.
- In `renderKnBlockLines` (Kingdom News cards): apply the same greedy change for the `-- Key: Value` stat line detection.
- The display always renders with `key + ': '` so space is guaranteed in output regardless.

## Acceptance Criteria

All key:value pairs in Own Kingdom Summary, Thievery Impacts, and Spell Impacts show 'key: value' with a space after the colon in both raw output and UI.

