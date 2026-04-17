---
id: scr-03rs
status: closed
deps: []
links: []
created: 2026-04-17T10:53:20Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "N,N books allocated to SHIELDING"

Unrecognized line reported 6 time(s) in context: kingdom-news.

Example line:
  19,656 books allocated to SHIELDING

Normalised pattern:
  N,N books allocated to SHIELDING

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

