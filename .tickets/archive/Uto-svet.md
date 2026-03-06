---
id: Uto-svet
status: closed
deps: []
links: []
created: 2026-03-03T02:22:29Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "We have proposed a ceasefire offer to Fluffys Hostil..."

Unrecognized line reported 1 time(s) in context: kingdom-news.

Example line:
  We have proposed a ceasefire offer to Fluffys Hostile pso (5:8). If accepted it will be unbreakable until April 21 of YR4!

Normalised pattern:
  We have proposed a ceasefire offer to Fluffys Hostile pso (K:K). If accepted it will be unbreakable until April N of YRN!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

