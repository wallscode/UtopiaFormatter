---
id: scr-dh52
status: closed
deps: []
links: []
created: 2026-05-27T20:29:01Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "N watch towers burned down!"

Unrecognized line reported 13 time(s) in context: province-news.

Example line:
  5 watch towers burned down!

Normalised pattern:
  N watch towers burned down!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is a successful Greater Arson thievery operation performed on my province by an enemy.  The specific building that they targeted was Watch Towers.  This should be captured in a list as Greater Arson with a list of the count and building types impacted.