---
id: Uto-i6fr
status: closed
deps: []
links: []
created: 2026-09-15T20:56:57Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "You have activated sitting mode, with Lord Mickey th..."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  You have activated sitting mode, with Lord Mickey the Commandant the Sorcerer as the sitter. Sitting will end on Fri, 4 Sep at 05:26 GMT+00:00

Normalised pattern:
  You have activated sitting mode, with Lord Mickey the Commandant the Sorcerer as the sitter. Sitting will end on Fri, N Sep at N:N GMT+N:N

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

