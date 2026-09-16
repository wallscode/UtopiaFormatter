---
id: Uto-yda1
status: closed
deps: []
links: []
created: 2026-09-15T20:56:26Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "A magic vortex encircled our lands, and rendered N o..."

Unrecognized line reported 1 time(s) in context: province-news.

Example line:
  A magic vortex encircled our lands, and rendered 1 of our spells (Meteor Showers) inactive!

Normalised pattern:
  A magic vortex encircled our lands, and rendered N of our spells (Meteor Showers) inactive!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

