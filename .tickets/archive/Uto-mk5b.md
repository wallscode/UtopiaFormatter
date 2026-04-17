---
id: Uto-mk5b
status: closed
deps: []
links: []
created: 2026-03-15T15:06:10Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "Your forces arrive at Rayko Dyakov (K:K). A tough ba..."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  Your forces arrive at Rayko Dyakov (3:10). A tough battle took place, but we have managed a victory! Your army has taken 244 acres! 151 acres of buildings survived and can be refitted to fit our needs. We also gained 297 specialist training credits. 746 peasants settled on your new lands.

Normalised pattern:
  Your forces arrive at Rayko Dyakov (K:K). A tough battle took place, but we have managed a victory! Your army has taken N acres! N acres of buildings survived and can be refitted to fit our needs. We also gained N specialist training credits. N peasants settled on your new lands.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

