---
id: Uto-au85
status: closed
deps: []
links: []
created: 2026-03-01T01:14:35Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "Drawing from the ancient Mana Well, you restore N% o..."

Unrecognized line reported 10 time(s) in context: province-logs.

Example line:
  Drawing from the ancient Mana Well, you restore 49% of your mana, ready to unleash your magic anew.

Normalised pattern:
  Drawing from the ancient Mana Well, you restore N% of your mana, ready to unleash your magic anew.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

