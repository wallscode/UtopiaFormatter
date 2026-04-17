---
id: scr-ql3y
status: open
deps: []
links: []
created: 2026-04-17T00:32:41Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "N,N books allocated to PRODUCTION"

Unrecognized line reported 1 time(s) in context: kingdom-news.

Example line:
  93,994 books allocated to PRODUCTION

Normalised pattern:
  N,N books allocated to PRODUCTION

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

