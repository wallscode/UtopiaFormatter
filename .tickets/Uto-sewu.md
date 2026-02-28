---
id: Uto-sewu
status: closed
deps: []
links: []
created: 2026-02-28T02:38:46Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "N,N books allocated to STRATEGY"

Unrecognized line reported 2 time(s) in context: province-logs.

Example line:
  1,184 books allocated to STRATEGY

Normalised pattern:
  N,N books allocated to STRATEGY

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

