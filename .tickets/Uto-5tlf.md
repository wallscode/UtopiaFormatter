---
id: Uto-5tlf
status: closed
deps: []
links: []
created: 2026-09-15T20:48:03Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "Your forces arrive at Slow poker (K:K). A tough batt..."

Unrecognized line reported 13 time(s) in context: province-logs.

Example line:
  Your forces arrive at Slow poker (6:10). A tough battle took place, but we have managed a victory! Your army burned and razed 51 acres of buildings!

Normalised pattern:
  Your forces arrive at Slow poker (K:K). A tough battle took place, but we have managed a victory! Your army burned and razed N acres of buildings!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

