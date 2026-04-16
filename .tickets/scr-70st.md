---
id: scr-70st
status: closed
deps: []
links: []
created: 2026-04-16T22:23:22Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "Your spell is disrupted by the natural leyline energ..."

Unrecognized line reported 2 time(s) in context: province-logs.

Example line:
  Your spell is disrupted by the natural leyline energies surrounding the target's Faery province, causing it to fail completely.

Normalised pattern:
  Your spell is disrupted by the natural leyline energies surrounding the target's Faery province, causing it to fail completely.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

