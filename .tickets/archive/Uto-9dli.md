---
id: Uto-9dli
status: closed
deps: []
links: []
created: 2026-02-28T02:38:40Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "We lost N thief in the operation."

Unrecognized line reported 8 time(s) in context: province-logs.

Example line:
  We lost 1 thief in the operation.

Normalised pattern:
  We lost N thief in the operation.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

