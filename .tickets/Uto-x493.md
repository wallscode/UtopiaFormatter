---
id: Uto-x493
status: closed
deps: []
links: []
created: 2026-09-15T20:52:58Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "The leader of Proton Perdana has chosen to join recr..."

Unrecognized line reported 3 time(s) in context: kingdom-news.

Example line:
  The leader of Proton Perdana has chosen to join recruting 1 active fighter (3:4). All in Proton Perdana gather their possessions and depart this kingdom forever.

Normalised pattern:
  The leader of Proton Perdana has chosen to join recruting N active fighter (K:K). All in Proton Perdana gather their possessions and depart this kingdom forever.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

