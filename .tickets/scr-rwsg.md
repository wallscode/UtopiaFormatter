---
id: scr-rwsg
status: closed
deps: []
links: []
created: 2026-05-27T20:29:19Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "N wizards were assassinated!"

Unrecognized line reported 2 time(s) in context: province-news.

Example line:
  17 wizards were assassinated!

Normalised pattern:
  N wizards were assassinated!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is a successful thievery operation called Assassinate Wizards performed by an enemy province on my province.  It should be captured as a successful thievery operation with the operation name "Assassinate Wizards" and the sum of wizards killed as the impact.