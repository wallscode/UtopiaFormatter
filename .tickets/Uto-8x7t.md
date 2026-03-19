---
id: Uto-8x7t
status: closed
deps: []
links: []
created: 2026-03-19T20:13:26Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "busy dnd pls (K:K) has broken their ceasefire agreem..."

Unrecognized line reported 1 time(s) in context: kingdom-news.

Example line:
  busy dnd pls (5:5) has broken their ceasefire agreement with us!

Normalised pattern:
  busy dnd pls (K:K) has broken their ceasefire agreement with us!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

