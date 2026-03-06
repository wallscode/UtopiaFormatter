---
id: Uto-43qv
status: closed
deps: []
links: []
created: 2026-02-27T21:05:08Z
type: feature
priority: 2
tags: [parser, province-logs]
---
# Province Logs parser: handle "N,N books allocated to FINESSE"

Unrecognized line reported 3 time(s) in context: province-logs.

Example line:
  7,800 books allocated to FINESSE

Normalised pattern:
  N,N books allocated to FINESSE

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

