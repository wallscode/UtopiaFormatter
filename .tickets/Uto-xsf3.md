---
id: Uto-xsf3
status: closed
deps: []
links: []
created: 2026-03-11T21:30:45Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "Forces from N - PROVINCE (K:K) came through and rava..."

Unrecognized line reported 1 time(s) in context: province-news.

Example line:
  Forces from 16 - Stormhelm (3:10) came through and ravaged our lands! Their armies razed 461 acres of buildings! We lost 17 soldiers, 86 Druids, 895 Beastmasters and 1,420 peasants in this battle. We reawakened 499 of our dead troops into soldiers. The enemy's attack has disrupted your infrastructure! Supply lines are damaged and craftsmen demoralized. Building efficiency reduced by 10% for 6 ticks.

Normalised pattern:
  Forces from N - PROVINCE (K:K) came through and ravaged our lands! Their armies razed N acres of buildings! We lost N troop name(s) in this battle.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is a raze attack I received from another player.  It should be recorded as an attack of type Raze in the Attacks received section with the number of acres razed.  Note that Razed acres are different than captured acres since it represents the total number of acres of buildings that were destroyed but no land was captured or exchanged.  I just have to rebuild the buildings.