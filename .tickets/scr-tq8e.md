---
id: scr-tq8e
status: open
deps: []
links: []
created: 2026-04-17T00:32:36Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Your wizards gather N,N runes and begin casting, and..."

Unrecognized line reported 2 time(s) in context: kingdom-news.

Example line:
  Your wizards gather 4,439 runes and begin casting, and the spell succeeds. Our lands are blessed with Shadowlight. The next time thieves enter our lands their identities will be revealed.

Normalised pattern:
  Your wizards gather N,N runes and begin casting, and the spell succeeds. Our lands are blessed with Shadowlight. The next time thieves enter our lands their identities will be revealed.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

