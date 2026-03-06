---
id: Uto-8ahx
status: closed
deps: []
links: []
created: 2026-02-27T21:05:38Z
type: feature
priority: 2
tags: [parser, province-logs]
---
# Province Logs parser: handle "You have ordered that N thieves be trained."

Unrecognized line reported 2 time(s) in context: province-logs.

Example line:
  You have ordered that 200 thieves be trained.

Normalised pattern:
  You have ordered that N thieves be trained.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This line is an order to train a type of military unit.  This should be included in a new section called Military Training and all units trained should be listed there with the total number of units trained by type.  The advanced settings should allow for this section to included or not included.
