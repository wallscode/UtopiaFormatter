---
id: scr-b3h2
status: closed
deps: []
links: []
created: 2026-04-17T10:53:17Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "You have donated N,N gold coins to the quest of laun..."

Unrecognized line reported 38 time(s) in context: kingdom-news.

Example line:
  You have donated 75,000 gold coins to the quest of launching a dragon.

Normalised pattern:
  You have donated N,N gold coins to the quest of launching a dragon.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

