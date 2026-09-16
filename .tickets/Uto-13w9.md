---
id: Uto-13w9
status: closed
deps: []
links: []
created: 2026-09-15T20:52:49Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "Your generals coordinate brilliantly, outmaneuvering..."

Unrecognized line reported 3 time(s) in context: province-logs.

Example line:
  Your generals coordinate brilliantly, outmaneuvering the enemy at every turn and inflicting devastating casualties.

Normalised pattern:
  Your generals coordinate brilliantly, outmaneuvering the enemy at every turn and inflicting devastating casualties.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

