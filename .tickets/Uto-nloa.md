---
id: Uto-nloa
status: closed
deps: []
links: []
created: 2026-03-15T15:04:45Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "You have cancelled N thieves' dens."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  You have cancelled 35 thieves' dens.

Normalised pattern:
  You have cancelled N thieves' dens.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

