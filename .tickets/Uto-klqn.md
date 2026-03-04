---
id: Uto-klqn
status: closed
deps: []
links: []
created: 2026-03-03T02:22:17Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "Your reply was posted successfully."

Unrecognized line reported 50 time(s) in context: province-logs.

Example line:
  Your reply was posted successfully.

Normalised pattern:
  Your reply was posted successfully.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

