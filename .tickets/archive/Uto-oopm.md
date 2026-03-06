---
id: Uto-oopm
status: closed
deps: []
links: []
created: 2026-02-27T21:04:39Z
type: feature
priority: 2
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "A ritual is covering our lands! (Haste)"

Unrecognized line reported 8 time(s) in context: kingdom-news.

Example line:
  A ritual is covering our lands! (Haste)

Normalised pattern:
  A ritual is covering our lands! (Haste)

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is a Ritual called Haste being successfully cast in our kingdom.  It should be recorded in the Rituals section and the type of Ritual should be included as well.  Make sure that the advanced settings section allows for Rituals to toggled off.

