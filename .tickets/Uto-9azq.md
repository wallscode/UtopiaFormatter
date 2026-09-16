---
id: Uto-9azq
status: closed
deps: []
links: []
created: 2026-09-15T20:57:27Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "The dragon is complete and has begun its flight to S..."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  The dragon is complete and has begun its flight to SLOW KD (6:10).

Normalised pattern:
  The dragon is complete and has begun its flight to SLOW KD (K:K).

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

