---
id: scr-a6v5
status: closed
deps: []
links: []
created: 2026-04-17T10:53:24Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news, province-logs]
---
# Kingdom News parser: handle "Alas, Viscount Harry Tit it appears our army was muc..."

Unrecognized line reported 2 time(s) in context: kingdom-news, province-logs.

Example line:
  Alas, Viscount Harry Tit it appears our army was much too weak to break their defenses!

Normalised pattern:
  Alas, Viscount Harry Tit it appears our army was much too weak to break their defenses!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

