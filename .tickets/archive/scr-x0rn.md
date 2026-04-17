---
id: scr-x0rn
status: closed
deps: []
links: []
created: 2026-04-17T00:32:34Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "N,N books allocated to RESILIENCE"

Unrecognized line reported 3 time(s) in context: kingdom-news.

Example line:
  37,320 books allocated to RESILIENCE

Normalised pattern:
  N,N books allocated to RESILIENCE

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

