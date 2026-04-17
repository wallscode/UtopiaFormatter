---
id: scr-0drm
status: closed
deps: []
links: []
created: 2026-04-16T22:22:31Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "N peasants were kidnapped!"

Unrecognized line reported 8 time(s) in context: province-news.

Example line:
  853 peasants were kidnapped!

Normalised pattern:
  N peasants were kidnapped!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.
This is a successful kidnapping thievery attempt by an enemy province and should be tracked in the Thievery Impacts section.

