---
id: Uto-96vp
status: open
deps: []
links: []
created: 2026-11-20T01:21:46Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "Your dark magic seeps into the enemy land, withering..."

Unrecognized line reported 11 time(s) in context: province-logs.

Example line:
  Your dark magic seeps into the enemy land, withering 37 peasants with necrotic fallout.

Normalised pattern:
  Your dark magic seeps into the enemy land, withering N peasants with necrotic fallout.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

