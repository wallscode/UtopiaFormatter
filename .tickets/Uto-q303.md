---
id: Uto-q303
status: closed
deps: []
links: []
created: 2026-02-28T02:38:54Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "The power of Mana Well surges through your forces!"

Unrecognized line reported 2 time(s) in context: province-logs.

Example line:
  The power of Mana Well surges through your forces!

Normalised pattern:
  The power of Mana Well surges through your forces!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

