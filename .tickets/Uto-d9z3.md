---
id: Uto-d9z3
status: closed
deps: []
links: []
created: 2026-03-03T02:22:27Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Fluffys Hostile pso (K:K) has accepted our ceasefire..."

Unrecognized line reported 1 time(s) in context: kingdom-news.

Example line:
  Fluffys Hostile pso (5:8) has accepted our ceasefire proposal! It will be unbreakable until April 21 of YR4!

Normalised pattern:
  Fluffys Hostile pso (K:K) has accepted our ceasefire proposal! It will be unbreakable until April N of YRN!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

