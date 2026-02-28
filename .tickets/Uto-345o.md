---
id: Uto-345o
status: closed
deps: []
links: []
created: 2026-02-28T02:38:58Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "Lord Benni, to explore N acres, we have sent out an ..."

Unrecognized line reported 2 time(s) in context: province-logs.

Example line:
  Lord Benni, to explore 40 acres, we have sent out an expedition of 800 soldiers at a cost of 233,600 gold coins. We expect all of the land to be settled by January 13 of YR8.

Normalised pattern:
  Lord Benni, to explore N acres, we have sent out an expedition of N soldiers at a cost of N,N gold coins. We expect all of the land to be settled by January N of YRN.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

