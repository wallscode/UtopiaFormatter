---
id: Uto-0kmq
status: closed
deps: []
links: []
created: 2026-09-15T20:49:55Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "Elite troops have been found with enemy propaganda, ..."

Unrecognized line reported 5 time(s) in context: province-news.

Example line:
  Elite troops have been found with enemy propaganda, but so far none have defected.

Normalised pattern:
  Elite troops have been found with enemy propaganda, but so far none have defected.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

