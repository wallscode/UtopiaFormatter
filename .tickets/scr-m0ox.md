---
id: scr-m0ox
status: open
deps: []
links: []
created: 2026-04-17T00:32:33Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "You have donated N,N,N gold coins to the quest of la..."

Unrecognized line reported 3 time(s) in context: kingdom-news.

Example line:
  You have donated 1,000,000 gold coins to the quest of launching a dragon.

Normalised pattern:
  You have donated N,N,N gold coins to the quest of launching a dragon.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

