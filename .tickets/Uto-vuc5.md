---
id: Uto-vuc5
status: closed
deps: []
links: []
created: 2026-09-15T20:57:39Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "Forces from N - PROVINCE (K:K) came through and rava..."

Unrecognized line reported 1 time(s) in context: province-news.

Example line:
  Forces from 14 - Slow Helen of Troy (6:10) came through and ravaged our lands! They were able to capture 58 acres before we could turn them away! We lost 4 soldiers, 47 Zombies and 12 Ghouls in this battle.

Normalised pattern:
  Forces from N - PROVINCE (K:K) came through and ravaged our lands! They were able to capture N acres before we could turn them away! We lost N soldiers, N Zombies and N Ghouls in this battle.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

