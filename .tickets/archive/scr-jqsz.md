---
id: scr-jqsz
status: closed
deps: []
links: []
created: 2026-04-17T10:53:20Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Your wizards gather N,N runes and begin casting, and..."

Unrecognized line reported 7 time(s) in context: kingdom-news.

Example line:
  Your wizards gather 4,096 runes and begin casting, and the spell succeeds. Our peasants begin mining with an imbued magical aura surrounding them increasing our revenues for 18 days!

Normalised pattern:
  Your wizards gather N,N runes and begin casting, and the spell succeeds. Our peasants begin mining with an imbued magical aura surrounding them increasing our revenues for N days!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

