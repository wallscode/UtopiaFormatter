---
id: Uto-1lss
status: open
deps: []
links: []
created: 2026-02-27T21:05:01Z
type: feature
priority: 2
tags: [parser, province-logs]
---
# Province Logs parser: handle "Lord Benni, to explore N acres, we have sent out an ..."

Unrecognized line reported 3 time(s) in context: province-logs.

Example line:
  Lord Benni, to explore 10 acres, we have sent out an expedition of 90 soldiers at a cost of 29,240 gold coins. We expect all of the land to be settled by July 10 of YR8.

Normalised pattern:
  Lord Benni, to explore N acres, we have sent out an expedition of N soldiers at a cost of N,N gold coins. We expect all of the land to be settled by July N of YRN.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

