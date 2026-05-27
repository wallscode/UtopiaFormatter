---
id: scr-ws63
status: closed
deps: []
links: []
created: 2026-05-04T12:15:51Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "Remember the Titans disrupts the arcane! N runes dis..."

Unrecognized line reported 1 time(s) in context: province-news.

Example line:
  Remember the Titans disrupts the arcane! 480 runes dissipate into nothingness.

Normalised pattern:
  Remember the Titans disrupts the arcane! N runes dissipate into nothingness.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is an event where a Dragon destroyed runes.  It should be tracked in a new section called Dragon impacts.