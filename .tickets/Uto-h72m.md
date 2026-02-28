---
id: Uto-h72m
status: closed
deps: []
links: []
created: 2026-02-28T02:39:04Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "N,N books allocated to HOUSING"

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  8,200 books allocated to HOUSING

Normalised pattern:
  N,N books allocated to HOUSING

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

