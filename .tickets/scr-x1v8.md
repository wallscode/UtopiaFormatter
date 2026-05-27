---
id: scr-x1v8
status: closed
deps: []
links: []
created: 2026-05-04T11:16:09Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "The Dark Pact takes hold, reanimating N wizards, N s..."

Unrecognized line reported 3 time(s) in context: province-logs.

Example line:
  The Dark Pact takes hold, reanimating 8 wizards, 16 soldiers, and 8 peasants from the enemy's fallen forces.

Normalised pattern:
  The Dark Pact takes hold, reanimating N wizards, N soldiers, and N peasants from the enemy's fallen forces.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is a unique ability for Necromancers where they reanimate fallen enemies and keep them for their own province. It should be parsed and added to the data structure as a reanimation event. The number of each type of unit reanimated should be kept and added in the optional view as a Necromancer reanimation event and the total impact of reanimation, but by default this should be toggled off.