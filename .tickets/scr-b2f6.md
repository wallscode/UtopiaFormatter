---
id: scr-b2f6
status: closed
deps: []
links: []
created: 2026-05-04T12:15:54Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "Your soldiers have slain the dragon!"

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  Your soldiers have slain the dragon!

Normalised pattern:
  Your soldiers have slain the dragon!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is a dragon slaying event.  We should track this as a contribution to slaying the dragon.
