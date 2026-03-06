---
id: Uto-ximw
status: closed
deps: []
links: []
created: 2026-02-28T02:39:04Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "N books allocated to CRIME"

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  284 books allocated to CRIME

Normalised pattern:
  N books allocated to CRIME

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

