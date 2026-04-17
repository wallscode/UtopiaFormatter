---
id: Uto-mkls
status: closed
deps: []
links: []
created: 2026-03-12T00:33:20Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Time has sent an aid shipment to Age of time."

Unrecognized line reported 2 time(s) in context: kingdom-news.

Example line:
  Time has sent an aid shipment to Age of time.

Normalised pattern:
  Time has sent an aid shipment to Age of time.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

