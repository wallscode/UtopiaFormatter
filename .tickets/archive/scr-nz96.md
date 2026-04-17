---
id: scr-nz96
status: closed
deps: []
links: []
created: 2026-04-17T10:53:17Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Your wizards gather N,N runes and begin casting, and..."

Unrecognized line reported 15 time(s) in context: kingdom-news.

Example line:
  Your wizards gather 4,357 runes and begin casting, and the spell succeeds. 40,310 gold coins have fallen from the trees!

Normalised pattern:
  Your wizards gather N,N runes and begin casting, and the spell succeeds. N,N gold coins have fallen from the trees!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

