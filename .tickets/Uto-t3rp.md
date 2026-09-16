---
id: Uto-t3rp
status: closed
deps: []
links: []
created: 2026-09-15T20:49:38Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "Well crap that worked's arrival sears the sky! N off..."

Unrecognized line reported 6 time(s) in context: province-news.

Example line:
  Well crap that worked's arrival sears the sky! 83 offensive specialists burn to ash, at home and abroad.

Normalised pattern:
  Well crap that worked's arrival sears the sky! N offensive specialists burn to ash, at home and abroad.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

