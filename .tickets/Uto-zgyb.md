---
id: Uto-zgyb
status: open
deps: []
links: []
created: 2026-09-15T20:54:43Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "You have ordered the academy to start training wizards."

Unrecognized line reported 2 time(s) in context: province-logs.

Example line:
  You have ordered the academy to start training wizards.

Normalised pattern:
  You have ordered the academy to start training wizards.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

