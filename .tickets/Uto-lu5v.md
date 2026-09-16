---
id: Uto-lu5v
status: open
deps: []
links: []
created: 2026-09-15T20:50:49Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "Your peasants become unmotivated and less willing to..."

Unrecognized line reported 4 time(s) in context: province-news.

Example line:
  Your peasants become unmotivated and less willing to join the army for 8 days

Normalised pattern:
  Your peasants become unmotivated and less willing to join the army for N days

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

