---
id: Uto-u2my
status: closed
deps: []
links: []
created: 2026-02-28T02:38:49Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "You have given orders to commence work on N forts."

Unrecognized line reported 2 time(s) in context: province-logs.

Example line:
  You have given orders to commence work on 50 forts.

Normalised pattern:
  You have given orders to commence work on N forts.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

