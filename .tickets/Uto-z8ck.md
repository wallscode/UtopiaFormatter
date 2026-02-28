---
id: Uto-z8ck
status: closed
deps: []
links: []
created: 2026-02-28T02:39:12Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "Sources have indicated the mission was foiled. We lo..."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  Sources have indicated the mission was foiled. We lost 6 thieves. If we are lucky, they will not rat on who sent them. I am sorry, we will train harder for the next mission. (VercingetoFist (4:11), sent 600)

Normalised pattern:
  Sources have indicated the mission was foiled. We lost N thieves. If we are lucky, they will not rat on who sent them. I am sorry, we will train harder for the next mission. (VercingetoFist (K:K), sent N)

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

