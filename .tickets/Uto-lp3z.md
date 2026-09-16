---
id: Uto-lp3z
status: closed
deps: []
links: []
created: 2026-09-15T20:53:26Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "A magic vortex encircled our lands, and rendered N o..."

Unrecognized line reported 3 time(s) in context: province-news.

Example line:
  A magic vortex encircled our lands, and rendered 3 of our spells (Minor Protection, Chastity and Greed) inactive!

Normalised pattern:
  A magic vortex encircled our lands, and rendered N of our spells (Minor Protection, Chastity and Greed) inactive!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

