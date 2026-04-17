---
id: Uto-ehqi
status: closed
deps: []
links: []
created: 2026-03-15T15:05:01Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "Your troops march onto the battlefield and are quick..."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  Your troops march onto the battlefield and are quickly driven back, unable to break through!

Normalised pattern:
  Your troops march onto the battlefield and are quickly driven back, unable to break through!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

