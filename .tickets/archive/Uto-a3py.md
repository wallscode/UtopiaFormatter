---
id: Uto-a3py
status: closed
deps: []
links: []
created: 2026-02-28T02:38:47Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "N,N books allocated to VALOR"

Unrecognized line reported 2 time(s) in context: province-logs.

Example line:
  5,700 books allocated to VALOR

Normalised pattern:
  N,N books allocated to VALOR

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

