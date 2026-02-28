---
id: Uto-th6y
status: closed
deps: []
links: []
created: 2026-02-28T02:39:14Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "Sources have indicated the mission was foiled. We lo..."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  Sources have indicated the mission was foiled. We lost 18 thieves. If we are lucky, they will not rat on who sent them. I am sorry, we will train harder for the next mission. (Back From The Edge (4:8), sent 1000)

Normalised pattern:
  Sources have indicated the mission was foiled. We lost N thieves. If we are lucky, they will not rat on who sent them. I am sorry, we will train harder for the next mission. (Back From The Edge (K:K), sent N)

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

