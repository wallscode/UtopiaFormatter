---
id: Uto-85kq
status: closed
deps: []
links: []
created: 2026-03-12T00:33:19Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Ill be there in a tick has sent an aid shipment to T..."

Unrecognized line reported 2 time(s) in context: kingdom-news.

Example line:
  Ill be there in a tick has sent an aid shipment to Timeless Rock Band.

Normalised pattern:
  Province Name has sent an aid shipment to Province Name.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is another instance of province sending aid to another province.  This should be counted as an aid shipment in the aid shipments section.