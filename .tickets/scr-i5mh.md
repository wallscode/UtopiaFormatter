---
id: scr-i5mh
status: closed
deps: []
links: []
created: 2026-05-04T12:15:24Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "N of our troops were found dead today!"

Unrecognized line reported 5 time(s) in context: province-news.

Example line:
  9 of our troops were found dead today!

Normalised pattern:
  N of our troops were found dead today!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is a Night Strike event received by the province and should be tracked as such.  Keep track of the number of troops lost.