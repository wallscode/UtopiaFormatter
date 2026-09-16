---
id: Uto-tjzj
status: closed
deps: []
links: []
created: 2026-09-15T20:55:48Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "Your forces arrive at Slow Elf Mystic (K:K). A tough..."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  Your forces arrive at Slow Elf Mystic (6:10). A tough battle took place, but we have managed a victory! Your army looted 217,169 gold coins, 43,612 bushels and 19,376 runes!

Normalised pattern:
  Your forces arrive at Slow Elf Mystic (K:K). A tough battle took place, but we have managed a victory! Your army looted N,N gold coins, N,N bushels and N,N runes!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

