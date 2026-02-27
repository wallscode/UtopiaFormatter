---
id: Uto-gq82
status: closed
deps: []
links: []
created: 2026-02-27T21:04:47Z
type: feature
priority: 2
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Unnamed kingdom (K:K) has cancelled their dragon pro..."

Unrecognized line reported 8 time(s) in context: kingdom-news.

Example line:
  Unnamed kingdom (5:3) has cancelled their dragon project targeted at us.

Normalised pattern:
  Unnamed kingdom (K:K) has cancelled their dragon project targeted at us.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This line indicates that a kingdom has cancelled a dragon project targeted at our kingdom.  It can be left out by default, but should be included in the Dragon Projects section if enabled in the advanced settings.

Add a checkbox to the advanced settings to include cancelled dragon projects in the Dragon Projects section.ß