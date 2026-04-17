---
id: scr-99sf
status: closed
deps: []
links: []
created: 2026-04-17T10:53:30Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Your wizards gather N,N runes and begin casting, but..."

Unrecognized line reported 1 time(s) in context: kingdom-news.

Example line:
  Your wizards gather 4,651 runes and begin casting, but the spell fails. Something went terribly wrong with our spell. 87 wizards were killed in an explosion!

Normalised pattern:
  Your wizards gather N,N runes and begin casting, but the spell fails. Something went terribly wrong with our spell. N wizards were killed in an explosion!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

