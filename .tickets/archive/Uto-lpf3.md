---
id: Uto-lpf3
status: closed
deps: []
links: []
created: 2026-03-19T20:13:29Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Utopian Problems (K:K) has broken their ceasefire ag..."

Unrecognized line reported 1 time(s) in context: kingdom-news.

Example line:
  Utopian Problems (5:11) has broken their ceasefire agreement with us!

Normalised pattern:
  Utopian Problems (K:K) has broken their ceasefire agreement with us!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

