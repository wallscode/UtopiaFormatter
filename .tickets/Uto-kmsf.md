---
id: Uto-kmsf
status: closed
deps: []
links: []
created: 2026-02-28T02:39:10Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "You have ordered that N,N soldiers be released from ..."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  You have ordered that 12,856 soldiers be released from duty.

Normalised pattern:
  You have ordered that N,N soldiers be released from duty.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

