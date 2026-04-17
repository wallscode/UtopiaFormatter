---
id: Uto-ffw6
status: closed
deps: []
links: []
created: 2026-03-15T15:04:54Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "The power of Sneak Attack surges through your forces!"

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  The power of Sneak Attack surges through your forces!

Normalised pattern:
  The power of Sneak Attack surges through your forces!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

