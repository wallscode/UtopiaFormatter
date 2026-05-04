---
id: scr-wtpq
status: open
deps: []
links: []
created: 2026-05-04T11:16:40Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "Forces from An unknown province from Time for Nerds ..."

Unrecognized line reported 1 time(s) in context: province-news.

Example line:
  Forces from An unknown province from Time for Nerds (3:11) attempted to attack us, but failed miserably! We lost 2 soldiers, 148 Harpies, 246 Drakes and 137 peasants in this battle.

Normalised pattern:
  Forces from An unknown province from Time for Nerds (K:K) attempted to attack us, but failed miserably! We lost N soldiers, N Harpies, N Drakes and N peasants in this battle.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

