---
id: Uto-elz8
status: open
deps: []
links: []
created: 2026-02-27T21:04:28Z
type: feature
priority: 2
tags: [parser, province-logs]
---
# Province Logs parser: handle "We lost N thieves in the operation."

Unrecognized line reported 11 time(s) in context: province-logs.

Example line:
  We lost 17 thieves in the operation.

Normalised pattern:
  We lost N thieves in the operation.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

