---
id: scr-ayd0
status: closed
deps: []
links: []
created: 2026-05-04T12:15:30Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "You send out N troop to fight the dragon. All are lo..."

Unrecognized line reported 2 time(s) in context: province-logs.

Example line:
  You send out 1 troop to fight the dragon. All are lost in the fight, but the dragon is weakened by 10 points.

Normalised pattern:
  You send out N troop to fight the dragon. All are lost in the fight, but the dragon is weakened by N points.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is a dragon contribution where I sent troops to fight the dragon and weakened it.  I think this is already tracked, but maybe the current tracking doesn't keep track of small numbers without commas.  Either way we should track this as a contribution to slaying the dragon.