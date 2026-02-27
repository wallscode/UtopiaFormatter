---
id: Uto-drto
status: open
deps: []
links: []
created: 2026-02-27T21:04:54Z
type: feature
priority: 2
tags: [parser, province-logs]
---
# Province Logs parser: handle "Sources have indicated the mission was foiled. We lo..."

Unrecognized line reported 4 time(s) in context: province-logs.

Example line:
  Sources have indicated the mission was foiled. We lost 21 thieves. If we are lucky, they will not rat on who sent them. I am sorry, we will train harder for the next mission. (Mat Phoria Salleh (4:11), sent 1420)

Normalised pattern:
  Sources have indicated the mission was foiled. We lost N thieves. If we are lucky, they will not rat on who sent them. I am sorry, we will train harder for the next mission. (Mat Phoria Salleh (K:K), sent N)

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

