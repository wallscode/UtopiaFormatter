---
id: scr-xuto
status: closed
deps: []
links: []
created: 2026-04-17T00:32:30Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Your wizards gather N,N runes and begin casting, but..."

Unrecognized line reported 5 time(s) in context: kingdom-news.

Example line:
  Your wizards gather 1,635 runes and begin casting, but the spell fails.

Normalised pattern:
  Your wizards gather N,N runes and begin casting, but the spell fails.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

