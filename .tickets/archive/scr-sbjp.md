---
id: scr-sbjp
status: closed
deps: []
links: []
created: 2026-04-17T00:32:33Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Your wizards gather N,N runes and begin casting, but..."

Unrecognized line reported 3 time(s) in context: kingdom-news.

Example line:
  Your wizards gather 3,505 runes and begin casting, but the spell fails. Something went terribly wrong with our spell. 19 wizards were killed in an explosion! (Dilbert (3:11))

Normalised pattern:
  Your wizards gather N,N runes and begin casting, but the spell fails. Something went terribly wrong with our spell. N wizards were killed in an explosion! (PROVINCE (K:K))

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

