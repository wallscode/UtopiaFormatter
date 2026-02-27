---
id: Uto-m9xy
status: closed
deps: []
links: []
created: 2026-02-27T21:04:59Z
type: feature
priority: 2
tags: [parser, province-logs]
---
# Province Logs parser: handle "N,N books allocated to CHANNELING"

Unrecognized line reported 3 time(s) in context: province-logs.

Example line:
  1,184 books allocated to CHANNELING

Normalised pattern:
  N,N books allocated to CHANNELING

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

