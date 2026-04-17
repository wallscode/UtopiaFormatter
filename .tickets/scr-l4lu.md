---
id: scr-l4lu
status: open
deps: []
links: []
created: 2026-04-17T00:32:40Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "You have destroyed N armouries and N universities."

Unrecognized line reported 1 time(s) in context: kingdom-news.

Example line:
  You have destroyed 431 armouries and 200 universities.

Normalised pattern:
  You have destroyed N armouries and N universities.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

