---
id: Uto-bmur
status: closed
deps: []
links: []
created: 2026-09-15T20:50:16Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "The dead march on! N fallen warriors rise as soldier..."

Unrecognized line reported 5 time(s) in context: province-logs.

Example line:
  The dead march on! 7 fallen warriors rise as soldiers, joining your unstoppable legion.

Normalised pattern:
  The dead march on! N fallen warriors rise as soldiers, joining your unstoppable legion.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

