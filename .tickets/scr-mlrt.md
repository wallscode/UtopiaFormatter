---
id: scr-mlrt
status: open
deps: []
links: []
created: 2026-04-17T00:32:35Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Your wizards gather N,N runes and begin casting, and..."

Unrecognized line reported 2 time(s) in context: kingdom-news.

Example line:
  Your wizards gather 1,635 runes and begin casting, and the spell succeeds. Our peasantry is influenced by a magical calm. We expect birth rates to be higher for 13 days!

Normalised pattern:
  Your wizards gather N,N runes and begin casting, and the spell succeeds. Our peasantry is influenced by a magical calm. We expect birth rates to be higher for N days!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

