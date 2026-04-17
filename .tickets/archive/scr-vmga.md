---
id: scr-vmga
status: closed
deps: []
links: []
created: 2026-04-17T10:53:23Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Your wizards gather N,N runes and begin casting, and..."

Unrecognized line reported 3 time(s) in context: kingdom-news.

Example line:
  Your wizards gather 1,361 runes and begin casting, and the spell succeeds. The magical auras within our province will protect us from the black magic of our enemies for 20 days!

Normalised pattern:
  Your wizards gather N,N runes and begin casting, and the spell succeeds. The magical auras within our province will protect us from the black magic of our enemies for N days!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

