---
id: Uto-f2pd
status: closed
deps: []
links: []
created: 2026-03-06T12:11:47Z
type: task
priority: 2
assignee: Jamie Walls
---
# Unknown lines script: filter non-date lines and remove known-ignorable patterns

The unknown lines logging script currently records too much noise. It should be tightened to only log lines that are genuinely unrecognized game content.

## Acceptance Criteria

- Lines not starting with the game-specific date format are silently ignored (not logged)
- Lines that have been reviewed and confirmed ignorable (e.g. Edition headers, ceasefire/diplomatic messages already handled by parsers, etc.) are excluded from logging
- Only lines that start with a valid date prefix AND are not recognized by any parser pattern produce a log entry
- Existing known-ignorable patterns are catalogued and removed from the output

