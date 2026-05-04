---
id: scr-ry8i
status: open
deps: []
links: []
created: 2026-05-04T11:16:22Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "Forces from N - PROVINCE (K:K) attempted to attack u..."

Unrecognized line reported 1 time(s) in context: province-news.

Example line:
  Forces from 1 - Sheldon Cooper (3:11) attempted to attack us, but failed miserably! We lost 76 Griffins and 180 Drakes in this battle.

Normalised pattern:
  Forces from N - PROVINCE (K:K) attempted to attack us, but failed miserably! We lost N Griffins and N Drakes in this battle.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

