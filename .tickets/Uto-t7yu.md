---
id: Uto-t7yu
status: closed
deps: []
links: []
created: 2026-09-15T20:55:27Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "N book allocated to HEROISM"

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  1 book allocated to HEROISM

Normalised pattern:
  N book allocated to HEROISM

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

