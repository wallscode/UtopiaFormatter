---
id: scr-qwsn
status: closed
deps: []
links: []
created: 2026-04-17T10:53:19Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "You have given orders to commence work on N homes, N..."

Unrecognized line reported 9 time(s) in context: kingdom-news.

Example line:
  You have given orders to commence work on 15 homes, 25 farms and 15 watch towers.

Normalised pattern:
  You have given orders to commence work on N homes, N farms and N watch towers.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

