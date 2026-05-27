---
id: scr-wtpq
status: closed
deps: []
links: []
created: 2026-05-04T11:16:40Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "Forces from An unknown province from Time for Nerds ..."

Unrecognized line reported 1 time(s) in context: province-news.

Example line:
  Forces from An unknown province from Time for Nerds (3:11) attempted to attack us, but failed miserably! We lost 2 soldiers, 148 Harpies, 246 Drakes and 137 peasants in this battle.

Normalised pattern:
  Forces from An unknown province from Time for Nerds (K:K) attempted to attack us, but failed miserably! We lost N soldiers, N Harpies, N Drakes and N peasants in this battle.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is a failed attack event where an enemy province attempted to attack us but failed. In this case the enemy province used the spell Anonymity to hide their identity, so we should capture the province name as "An unknown province (N:N)". It should be parsed and added to the data structure as a failed attack event.  We should keep track of the number and type of troops lost.  The province name should be kept as an optional value to be added in the optional view but the summary should retain only the number of failed attacks and the impact of losses.  In the normalised pattern, the troop types "Soldiers", "Harpies", "Drakes", and "Peasants" are unique to this race and will be different for different races so that should be captured as a dynamic field in the data structure.