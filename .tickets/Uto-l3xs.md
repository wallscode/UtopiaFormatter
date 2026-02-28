---
id: Uto-l3xs
status: closed
deps: []
links: []
created: 2026-02-28T02:39:13Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "N,N books allocated to BOOKKEEPING"

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  18,040 books allocated to BOOKKEEPING

Normalised pattern:
  N,N books allocated to BOOKKEEPING

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

