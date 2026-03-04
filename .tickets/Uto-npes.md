---
id: Uto-npes
status: closed
deps: []
links: []
created: 2026-03-04T22:13:24Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "The natural leyline energies surrounding your provin..."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  The natural leyline energies surrounding your province disrupt the incoming spell, causing it to fail before taking effect.

Normalised pattern:
  The natural leyline energies surrounding your province disrupt the incoming spell, causing it to fail before taking effect.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This can be skipped as it's just a message about a spell being blocked and doesn't fit into any of the existing categories.
