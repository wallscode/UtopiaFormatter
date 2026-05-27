---
id: scr-orpf
status: closed
deps: []
links: []
created: 2026-05-04T12:15:48Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "Alas, our war has ended! N acres were instantly retu..."

Unrecognized line reported 1 time(s) in context: province-news.

Example line:
  Alas, our war has ended! 63 acres were instantly returned to us from our marching armies!! Put them to good use my Liege.

Normalised pattern:
  Alas, our war has ended! N acres were instantly returned to us from our marching armies!! Put them to good use my Liege.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is a war end event but can be ignored.  There is another event that tracks the end of war and impacts.  Also the acres returned is already captured in a different attack event so that number doesn't need to be retained.

