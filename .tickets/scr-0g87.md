---
id: scr-0g87
status: closed
deps: []
links: []
created: 2026-04-16T22:23:14Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "The ritual covering our lands has been lifted!"

Unrecognized line reported 2 time(s) in context: kingdom-news.

Example line:
  The ritual covering our lands has been lifted!

Normalised pattern:
  The ritual covering our lands has been lifted!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

