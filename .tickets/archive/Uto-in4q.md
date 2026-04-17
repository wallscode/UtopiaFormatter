---
id: Uto-in4q
status: closed
deps: []
links: []
created: 2026-03-15T12:54:30Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "A Topaz Dragon, N, from War Heroes and Generals (K:K..."

Unrecognized line reported 14 time(s) in context: kingdom-news.

Example line:
  A Topaz Dragon, 1, from War Heroes and Generals (3:10) has begun ravaging our lands!

Normalised pattern:
  A Topaz Dragon, N, from War Heroes and Generals (K:K) has begun ravaging our lands!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

