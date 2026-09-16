---
id: Uto-vvd1
status: closed
deps: []
links: []
created: 2026-09-15T20:49:03Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs, province-news]
---
# Province Logs parser: handle "The plague has finally been swept away from our lands!"

Unrecognized line reported 8 time(s) in context: province-logs, province-news.

Example line:
  The plague has finally been swept away from our lands!

Normalised pattern:
  The plague has finally been swept away from our lands!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

