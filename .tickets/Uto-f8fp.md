---
id: Uto-f8fp
status: closed
deps: []
links: []
created: 2026-03-15T21:43:36Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "The dragon ravaging our lands,N, has reduced to rubb..."

Unrecognized line reported 1 time(s) in context: province-news.

Example line:
  The dragon ravaging our lands,2, has reduced to rubble 53 of our precious buildings! This will not easily be forgotten...

Normalised pattern:
  The dragon ravaging our lands,N, has reduced to rubble N of our precious buildings! This will not easily be forgotten...

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

