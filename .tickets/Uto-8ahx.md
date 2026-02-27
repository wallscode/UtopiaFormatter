---
id: Uto-8ahx
status: open
deps: []
links: []
created: 2026-02-27T21:05:38Z
type: feature
priority: 2
tags: [parser, province-logs]
---
# Province Logs parser: handle "You have ordered that N thieves be trained."

Unrecognized line reported 2 time(s) in context: province-logs.

Example line:
  You have ordered that 200 thieves be trained.

Normalised pattern:
  You have ordered that N thieves be trained.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

