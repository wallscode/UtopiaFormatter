---
id: scr-bfuu
status: closed
deps: []
links: []
created: 2026-04-17T10:53:17Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "N,N books allocated to TACTICS"

Unrecognized line reported 15 time(s) in context: kingdom-news.

Example line:
  9,576 books allocated to TACTICS

Normalised pattern:
  N,N books allocated to TACTICS

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

