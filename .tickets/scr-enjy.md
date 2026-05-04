---
id: scr-enjy
status: open
deps: []
links: []
created: 2026-05-04T11:16:43Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle ")."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  ).

Normalised pattern:
  ).

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

