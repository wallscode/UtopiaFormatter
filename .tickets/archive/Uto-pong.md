---
id: Uto-pong
status: closed
deps: []
links: []
created: 2026-03-01T01:14:39Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Our kingdom has cancelled the dragon project to Unna..."

Unrecognized line reported 9 time(s) in context: kingdom-news.

Example line:
  Our kingdom has cancelled the dragon project to Unnamed kingdom (4:1).

Normalised pattern:
  Our kingdom has cancelled the dragon project to Unnamed kingdom (K:K).

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

