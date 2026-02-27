---
id: Uto-x99d
status: closed
deps: []
links: []
created: 2026-02-27T21:06:47Z
type: feature
priority: 2
tags: [parser, province-logs]
---
# Province Logs parser: handle "You have destroyed N banks."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  You have destroyed 220 banks.

Normalised pattern:
  You have destroyed N banks.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

