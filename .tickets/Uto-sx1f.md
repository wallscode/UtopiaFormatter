---
id: Uto-sx1f
status: closed
deps: []
links: []
created: 2026-02-28T02:39:18Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "Post edited successfully."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  Post edited successfully.

Normalised pattern:
  Post edited successfully.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

