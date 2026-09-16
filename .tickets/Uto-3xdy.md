---
id: Uto-3xdy
status: open
deps: []
links: []
created: 2026-09-15T20:57:56Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "We have received a shipment of N,N gold coins from L..."

Unrecognized line reported 1 time(s) in context: province-news.

Example line:
  We have received a shipment of 19,178 gold coins from Land Rover 110

Normalised pattern:
  We have received a shipment of N,N gold coins from Land Rover N

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

