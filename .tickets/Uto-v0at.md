---
id: Uto-v0at
status: closed
deps: []
links: []
created: 2026-09-15T20:55:32Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "The truant SamanthaSnowshoes of Aston Martin DBS has..."

Unrecognized line reported 1 time(s) in context: kingdom-news.

Example line:
  The truant SamanthaSnowshoes of Aston Martin DBS has been a neglectful leader, and the peasants have risen up and cast them out. Maybe someday a new leader will reinvigorate this once mighty province.

Normalised pattern:
  The truant SamanthaSnowshoes of Aston Martin DBS has been a neglectful leader, and the peasants have risen up and cast them out. Maybe someday a new leader will reinvigorate this once mighty province.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

