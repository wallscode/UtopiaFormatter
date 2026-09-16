---
id: Uto-5qf3
status: closed
deps: []
links: []
created: 2026-09-15T20:46:59Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs, province-news]
---
# Province Logs parser: handle "N acres of land have disappeared from our control!"

Unrecognized line reported 32 time(s) in context: province-logs, province-news.

Example line:
  12 acres of land have disappeared from our control!

Normalised pattern:
  N acres of land have disappeared from our control!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

