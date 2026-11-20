---
id: Uto-8rec
status: open
deps: []
links: []
created: 2026-11-20T01:22:38Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "Edition April YRN Edition"

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  Edition April YR8 Edition

Normalised pattern:
  Edition April YRN Edition

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

