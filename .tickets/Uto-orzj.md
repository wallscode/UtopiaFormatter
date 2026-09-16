---
id: Uto-orzj
status: closed
deps: []
links: []
created: 2026-09-15T20:57:42Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "Forces from N - PROVINCE (K:K) came through and rava..."

Unrecognized line reported 1 time(s) in context: province-news.

Example line:
  Forces from 23 - Slow Mother Father (6:10) came through and ravaged our lands! They were able to capture 24 acres before we could turn them away! We lost 4 soldiers, 41 Zombies and 1 Ghoul in this battle.

Normalised pattern:
  Forces from N - PROVINCE (K:K) came through and ravaged our lands! They were able to capture N acres before we could turn them away! We lost N soldiers, N Zombies and N Ghoul in this battle.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

