---
id: Uto-77km
status: closed
deps: []
links: []
created: 2026-02-27T21:06:51Z
type: feature
priority: 2
tags: [parser, province-logs]
---
# Province Logs parser: handle "You have ordered that N,N Archers be released from d..."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  You have ordered that 22,354 Archers be released from duty.

Normalised pattern:
  You have ordered that N,N Archers be released from duty.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is an indication of military units being released.  This should be included in the Military Training section but not shown by default.  It should be included in the advanced settings as an option to show troops released.