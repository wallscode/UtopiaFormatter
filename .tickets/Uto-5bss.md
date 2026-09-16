---
id: Uto-5bss
status: closed
deps: []
links: []
created: 2026-09-15T20:55:58Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "Your forces arrive at They made me do this (K:K). A ..."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  Your forces arrive at They made me do this (4:12). A tough battle took place, but we have managed a victory! Your army massacred 198 peasants, thieves, and wizards!

Normalised pattern:
  Your forces arrive at They made me do this (K:K). A tough battle took place, but we have managed a victory! Your army massacred N peasants, thieves, and wizards!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

