---
id: Uto-3dlo
status: open
deps: []
links: []
created: 2026-11-20T01:22:18Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "You have elected to stay with your kingdom mates whe..."

Unrecognized line reported 2 time(s) in context: province-logs.

Example line:
  You have elected to stay with your kingdom mates when the next age begins.

Normalised pattern:
  You have elected to stay with your kingdom mates when the next age begins.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

