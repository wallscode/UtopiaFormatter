---
id: scr-6rqv
status: closed
deps: []
links: []
created: 2026-05-27T20:29:07Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "Your army was no match for the defenses of Entry Tea..."

Unrecognized line reported 2 time(s) in context: province-logs.

Example line:
  Your army was no match for the defenses of Entry Team (2:6). They hastily retreat out of battle.

Normalised pattern:
  Your army was no match for the defenses of Entry Team (K:K). They hastily retreat out of battle.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is a failed attack on a province named Entry Team in kingdom 2:6.  It should be tracked as a failed attack.
