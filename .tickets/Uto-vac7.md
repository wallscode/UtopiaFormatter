---
id: Uto-vac7
status: closed
deps: []
links: []
created: 2026-03-15T21:43:26Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "Oh the horror! N, the dragon ravaging our lands has ..."

Unrecognized line reported 1 time(s) in context: province-news.

Example line:
  Oh the horror! 2, the dragon ravaging our lands has destroyed 54 of our buildings! Why 2, why!?

Normalised pattern:
  Oh the horror! N, the dragon ravaging our lands has destroyed N of our buildings! Why N, why!?

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

