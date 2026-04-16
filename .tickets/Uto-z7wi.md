---
id: Uto-z7wi
status: closed
deps: []
links: []
created: 2026-03-15T15:04:37Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "You have voted for Queen Nitebloom the Craftswoman o..."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  You have voted for Queen Nitebloom the Craftswoman of Misstress Of Time

Normalised pattern:
  You have voted for Queen Nitebloom the Craftswoman of Misstress Of Time

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

