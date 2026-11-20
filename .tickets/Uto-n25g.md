---
id: Uto-n25g
status: closed
deps: []
links: []
created: 2026-11-20T01:22:39Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "Alas, the relations to invoke Holy Inquisition were ..."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  Alas, the relations to invoke Holy Inquisition were not fulfilled, and its power slipped beyond our grasp.

Normalised pattern:
  Alas, the relations to invoke Holy Inquisition were not fulfilled, and its power slipped beyond our grasp.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.


## Notes

**2026-11-20T01:47:41Z**

Flavour text per user; ignored in Province Logs (any ritual name). Test added.
