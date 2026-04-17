---
id: scr-c1pd
status: closed
deps: []
links: []
created: 2026-04-17T10:53:21Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "You have given orders to commence work on N watch to..."

Unrecognized line reported 5 time(s) in context: kingdom-news.

Example line:
  You have given orders to commence work on 55 watch towers.

Normalised pattern:
  You have given orders to commence work on N watch towers.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

