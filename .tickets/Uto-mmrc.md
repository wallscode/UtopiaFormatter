---
id: Uto-mmrc
status: closed
deps: []
links: []
created: 2026-03-15T21:43:09Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "Chaotic energies amplify our actions! This attempt d..."

Unrecognized line reported 20 time(s) in context: province-logs.

Example line:
  Chaotic energies amplify our actions! This attempt deals 26% more damage than expected.

Normalised pattern:
  Chaotic energies amplify our actions! This attempt deals N% more damage than expected.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

