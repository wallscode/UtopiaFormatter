---
id: Uto-v8zh
status: closed
deps: []
links: []
created: 2026-03-11T21:30:43Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "Massacre attacks"

Unrecognized line reported 1 time(s) in context: province-news.

Example line:
  Multiple enemy generals coordinate their assault with ruthless precision, leaving your forces in disarray and suffering catastrophic casualties. Forces from 4 - hurricane (3:10) came through and ravaged our lands! Their armies killed 1961 of our peasants, thieves, and wizards! We lost 45 soldiers, 75 Druids, 784 Beastmasters and 1,022 peasants in this battle. We reawakened 452 of our dead troops into soldiers.

Normalised pattern:
  Forces from N - PROVINCE (K:K) came through and ravaged our lands! Their armies killed N of our peasants, thieves, and wizards! 

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is a massacre attack I received from another player.  It should be recorded as an attack in the Attacks received section with the number of troops killed.
