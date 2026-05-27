---
id: scr-k26y
status: closed
deps: []
links: []
created: 2026-05-27T20:29:17Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "N acres of buildings burned down!"

Unrecognized line reported 2 time(s) in context: province-news.

Example line:
  7 acres of buildings burned down!

Normalised pattern:
  N acres of buildings burned down!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This was a successful thievery operation called Arson performed by an enemy province on my province.  It should be captured as a successful thievery operation with the operation name "Arson" and the sum of acres destroyed as the impact.