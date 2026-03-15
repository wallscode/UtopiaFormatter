---
id: Uto-7thh
status: closed
deps: []
links: []
created: 2026-03-15T21:43:15Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "The dragon ravaging our lands,N, has destroyed N of ..."

Unrecognized line reported 1 time(s) in context: province-news.

Example line:
  The dragon ravaging our lands,1, has destroyed 49 of our buildings! When will the destruction end!?

Normalised pattern:
  The dragon ravaging our lands,N, has destroyed N of our buildings! When will the destruction end!?

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

