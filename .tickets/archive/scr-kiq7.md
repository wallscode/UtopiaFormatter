---
id: scr-kiq7
status: closed
deps: []
links: []
created: 2026-04-17T10:53:27Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "You have donated N,N,N gold coins to the quest of la..."

Unrecognized line reported 1 time(s) in context: kingdom-news.

Example line:
  You have donated 1,300,000 gold coins to the quest of launching a dragon. March 19 of YR9 Sources have indicated the mission was foiled. We lost 11 thieves. If we are lucky, they will not rat on who sent them. I am sorry, we will train harder for the next mission. (Annabeth Chase (3:11), sent 650)

Normalised pattern:
  You have donated N,N,N gold coins to the quest of launching a dragon. March N of YRN Sources have indicated the mission was foiled. We lost N thieves. If we are lucky, they will not rat on who sent them. I am sorry, we will train harder for the next mission. (PROVINCE (K:K), sent N)

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

