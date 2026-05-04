---
id: scr-b86i
status: closed
deps: []
links: []
created: 2026-05-04T11:16:02Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "A massive fireball crashed into our lands and killed..."

Unrecognized line reported 3 time(s) in context: province-news.

Example line:
  A massive fireball crashed into our lands and killed 40 peasants! The enemy's black magic spreads across your lands, killing 8 peasants with necrotic fallout!

Normalised pattern:
  A massive fireball crashed into our lands and killed N peasants! The enemy's black magic spreads across your lands, killing N peasants with necrotic fallout!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

The normal text for fireball is "A massive fireball crashed into our lands and killed N peasants!"  Anything after that is optional.  In the case where the text "The enemy's black magic spreads across your lands, killing N peasants with necrotic fallout!" is present, it should be parsed as well and the two values should be summed together to capture the full effect of peasants killed.

