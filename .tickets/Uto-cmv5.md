---
id: Uto-cmv5
status: closed
deps: []
links: []
created: 2026-03-11T11:10:34Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle Aid Shipments

Unrecognized line reported 4 time(s) in context: kingdom-news.

Example line:
  Fun times has sent an aid shipment to Timeless Rock Band.

Normalised pattern:
  Source province name has sent an aid shipment to Destination province name.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

The parser should track this as an aid shipment event and include it in the kingdom news output in a new Aid Shipments section.
The Aid Shipments section should count the number of aid shipments sent by each province and list them in descending order of shipment count.
The Aid Shipments section should also count the number of aid shipments received by each province and list them in descending order of shipment count.
The Aid Shipment section should be toggled off by default and should default to the bottom of the Section list.
The pattern is: Source province name has sent an aid shipment to Destination province name.