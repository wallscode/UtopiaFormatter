---
id: Uto-kahf
status: closed
deps: []
links: []
created: 2026-03-11T21:30:05Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "Meteors rain across our lands, and are not expected ..."

Unrecognized line reported 1 time(s) in context: province-news.

Example line:
  Meteors rain across our lands, and are not expected to stop for 9 days.

Normalised pattern:
  Meteors rain across our lands, and are not expected to stop for N days.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is the spell Meteor Showers that an enemy has cast on our province.  It should be tracked in the spell impact section with the duration.
