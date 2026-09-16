---
id: Uto-o9fd
status: closed
deps: []
links: []
created: 2026-09-15T20:54:36Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "As the ultimate betrayal, Jarack destroys all in the..."

Unrecognized line reported 2 time(s) in context: kingdom-news.

Example line:
  As the ultimate betrayal, Jarack destroys all in the land of Chevy Razor before leaving for a new kingdom.

Normalised pattern:
  As the ultimate betrayal, Jarack destroys all in the land of Chevy Razor before leaving for a new kingdom.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

