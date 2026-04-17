---
id: scr-1bdm
status: closed
deps: []
links: []
created: 2026-04-17T10:53:33Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "N,N books allocated to CUNNING"

Unrecognized line reported 1 time(s) in context: kingdom-news.

Example line:
  21,546 books allocated to CUNNING

Normalised pattern:
  N,N books allocated to CUNNING

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

