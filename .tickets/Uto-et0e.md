---
id: Uto-et0e
status: closed
deps: []
links: []
created: 2026-09-15T20:49:19Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Our monarch has forged an opportunity to enlarge our..."

Unrecognized line reported 7 time(s) in context: kingdom-news.

Example line:
  Our monarch has forged an opportunity to enlarge our kingdom, and extends a hand of friendship towards a recruit.

Normalised pattern:
  Our monarch has forged an opportunity to enlarge our kingdom, and extends a hand of friendship towards a recruit.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

