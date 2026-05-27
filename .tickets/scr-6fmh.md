---
id: scr-6fmh
status: closed
deps: []
links: []
created: 2026-05-04T12:15:40Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "Remember the Titans hungers for magic. N runes consu..."

Unrecognized line reported 1 time(s) in context: province-news.

Example line:
  Remember the Titans hungers for magic. 368 runes consumed by its unnatural appetite.

Normalised pattern:
  Remember the Titans hungers for magic. N runes consumed by its unnatural appetite.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is an event where a Dragon destroyed runes.  It should be tracked in a new section called Dragon impacts.