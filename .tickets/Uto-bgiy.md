---
id: Uto-bgiy
status: closed
deps: []
links: []
created: 2026-03-12T00:33:17Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "About time dude has sent an aid shipment to Timeless..."

Unrecognized line reported 2 time(s) in context: kingdom-news.

Example line:
  About time dude has sent an aid shipment to Timeless Rock Band.

Normalised pattern:
  About time dude has sent an aid shipment to Timeless Rock Band.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

