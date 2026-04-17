---
id: scr-hqy3
status: closed
deps: []
links: []
created: 2026-04-17T10:53:32Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "You have destroyed N military barracks, N forts and ..."

Unrecognized line reported 1 time(s) in context: kingdom-news.

Example line:
  You have destroyed 60 military barracks, 280 forts and 210 watch towers.

Normalised pattern:
  You have destroyed N military barracks, N forts and N watch towers.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

