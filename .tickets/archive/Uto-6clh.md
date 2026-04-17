---
id: Uto-6clh
status: closed
deps: []
links: []
created: 2026-03-15T21:43:39Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "The dragon ravaging our lands,N, has destroyed and t..."

Unrecognized line reported 1 time(s) in context: province-news.

Example line:
  The dragon ravaging our lands,1, has destroyed and turned to ash 51 of our buildings!

Normalised pattern:
  The dragon ravaging our lands,N, has destroyed and turned to ash N of our buildings!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

