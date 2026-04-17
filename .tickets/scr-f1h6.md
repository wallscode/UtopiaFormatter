---
id: scr-f1h6
status: open
deps: []
links: []
created: 2026-04-17T00:32:34Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "You have given orders to commence work on N homes, N..."

Unrecognized line reported 3 time(s) in context: kingdom-news.

Example line:
  You have given orders to commence work on 345 homes, 11 farms, 226 forts, 16 guilds, 11 towers and 77 thieves' dens.

Normalised pattern:
  You have given orders to commence work on N homes, N farms, N forts, N guilds, N towers and N thieves' dens.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

