---
id: Uto-ehwn
status: closed
deps: []
links: []
created: 2026-02-28T02:39:18Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "You have set your draft rate to Aggressive."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  You have set your draft rate to Aggressive.

Normalised pattern:
  You have set your draft rate to Aggressive.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

