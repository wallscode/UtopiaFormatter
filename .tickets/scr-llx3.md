---
id: scr-llx3
status: closed
deps: []
links: []
created: 2026-04-16T22:23:11Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "Your forces arrive at All too well N min version (K:..."

Unrecognized line reported 3 time(s) in context: province-logs.

Example line:
  Your forces arrive at All too well 10 min version (2:1). A tough battle took place, but we have managed a victory! Your army has recaptured 128 acres from our enemy! Taking full control of our new land will take 6.58 days, and will be available on January 20 of YR8.

Normalised pattern:
  Your forces arrive at All too well 10 min version (K:K). A tough battle took place, but we have managed a victory! Your army has recaptured N acres from our enemy! Taking full control of our new land will take N.N days, and will be available on Month N of YRN.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is a successful ambush attack by my province on an enemy province. It should be counted in a new Attacks section which should include all types of attacks (Traditional March, Ambush, Conquest, Raze, Learn, etc.)

