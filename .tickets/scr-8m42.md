---
id: scr-8m42
status: closed
deps: []
links: []
created: 2026-05-04T12:15:43Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "Topaz Dragon descends in flames! N buildings are red..."

Unrecognized line reported 1 time(s) in context: province-news.

Example line:
  Topaz Dragon descends in flames! 16 buildings are reduced to ash and rubble.

Normalised pattern:
  Topaz Dragon descends in flames! N buildings are reduced to ash and rubble.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is an event where a Dragon destroyed buildings.  It should be tracked in a new section called Dragon impacts.