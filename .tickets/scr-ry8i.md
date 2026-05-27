---
id: scr-ry8i
status: closed
deps: []
links: []
created: 2026-05-04T11:16:22Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "Forces from N - PROVINCE (K:K) attempted to attack u..."

Unrecognized line reported 1 time(s) in context: province-news.

Example line:
  Forces from 1 - Sheldon Cooper (3:11) attempted to attack us, but failed miserably! We lost 76 Griffins and 180 Drakes in this battle.

Normalised pattern:
  Forces from N - PROVINCE (K:K) attempted to attack us, but failed miserably! We lost N Griffins and N Drakes in this battle.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is a failed attack event where an enemy province attempted to attack us but failed.  It should be parsed and added to the data structure as a failed attack event.  We should keep track of the number and type of troops lost.  The province name should be kept as an optional value to be added in the optional view but the summary should retain only the number of failed attacks and the impact of losses.  In the normalised pattern, the troop types "Griffins" and "Drakes" are unique to this race and will be different for different races so that should be captured as a dynamic field in the data structure.