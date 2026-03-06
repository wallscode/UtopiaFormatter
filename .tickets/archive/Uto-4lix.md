---
id: Uto-4lix
status: closed
deps: []
links: []
created: 2026-02-28T02:39:08Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "You have ordered that N Elf Lords be trained."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  You have ordered that 13 Elf Lords be trained.

Normalised pattern:
  You have ordered that N Elf Lords be trained.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

