---
id: Uto-d0n7
status: closed
deps: []
links: []
created: 2026-09-15T20:47:39Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "Specialist troops have been found with enemy propaga..."

Unrecognized line reported 16 time(s) in context: province-news.

Example line:
  Specialist troops have been found with enemy propaganda, but so far none have defected.

Normalised pattern:
  Specialist troops have been found with enemy propaganda, but so far none have defected.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

