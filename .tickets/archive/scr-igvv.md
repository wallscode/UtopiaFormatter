---
id: scr-igvv
status: closed
deps: []
links: []
created: 2026-04-17T10:53:24Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Your wizards gather N,N runes and begin casting, and..."

Unrecognized line reported 2 time(s) in context: kingdom-news.

Example line:
  Your wizards gather 4,844 runes and begin casting, and the spell succeeds. A magic vortex overcomes the province of Pee Time (5:1), negating 3 active spells (Builders Boon, Nature's Blessing and Magic Shield). (Pee Time (5:1))

Normalised pattern:
  Your wizards gather N,N runes and begin casting, and the spell succeeds. A magic vortex overcomes the province of Pee Time (K:K), negating N active spells (Builders Boon, Nature's Blessing and Magic Shield). (PROVINCE (K:K))

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

