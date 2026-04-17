---
id: scr-0lom
status: closed
deps: []
links: []
created: 2026-04-17T00:32:34Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Sources have indicated the mission was foiled. We lo..."

Unrecognized line reported 3 time(s) in context: kingdom-news.

Example line:
  Sources have indicated the mission was foiled. We lost 24 thieves. If we are lucky, they will not rat on who sent them. I am sorry, we will train harder for the next mission. (Concordia (3:11), sent 2000)

Normalised pattern:
  Sources have indicated the mission was foiled. We lost N thieves. If we are lucky, they will not rat on who sent them. I am sorry, we will train harder for the next mission. (PROVINCE (K:K), sent N)

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

