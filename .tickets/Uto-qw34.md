---
id: Uto-qw34
status: closed
deps: []
links: []
created: 2026-03-12T00:33:18Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Fun times has sent an aid shipment to Sushi Sampo Time."

Unrecognized line reported 2 time(s) in context: kingdom-news.

Example line:
  Fun times has sent an aid shipment to Sushi Sampo Time.

Normalised pattern:
  Fun times has sent an aid shipment to Sushi Sampo Time.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

