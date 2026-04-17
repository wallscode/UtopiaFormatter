---
id: scr-n4om
status: closed
deps: []
links: []
created: 2026-04-17T10:53:18Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "N,N books allocated to ALCHEMY"

Unrecognized line reported 14 time(s) in context: kingdom-news.

Example line:
  2,838 books allocated to ALCHEMY

Normalised pattern:
  N,N books allocated to ALCHEMY

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

