---
id: Uto-69cr
status: closed
deps: []
links: []
created: 2026-03-11T21:30:08Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "A fit of gluttony has descended upon our people, and..."

Unrecognized line reported 1 time(s) in context: province-news.

Example line:
  A fit of gluttony has descended upon our people, and they will not be sated for 18 days.

Normalised pattern:
  A fit of gluttony has descended upon our people, and they will not be sated for N days.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is the spell Gluttony cast on my province by another player.  It should be recorded as a spell effect in the Spells section with the duration included.