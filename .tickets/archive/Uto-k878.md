---
id: Uto-k878
status: closed
deps: []
links: []
created: 2026-03-12T00:32:57Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Age of time has sent an aid shipment to Time Manipul..."

Unrecognized line reported 4 time(s) in context: kingdom-news.

Example line:
  Age of time has sent an aid shipment to Time Manipulator.

Normalised pattern:
  Province Name has sent an aid shipment to Province Name.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

