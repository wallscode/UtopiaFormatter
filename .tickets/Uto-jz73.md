---
id: Uto-jz73
status: closed
deps: []
links: []
created: 2026-02-27T21:04:33Z
type: feature
priority: 2
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "We have withdrawn our ceasefire proposal to Unnamed ..."

Unrecognized line reported 8 time(s) in context: kingdom-news.

Example line:
  We have withdrawn our ceasefire proposal to Unnamed kingdom (5:3).

Normalised pattern:
  We have withdrawn our ceasefire proposal to Unnamed kingdom (K:K).

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is a ceasefire proposal withdrawal.  It can be left out by default, but should be included in the Kingdom Relations section if enabled in the advanced settings.

Add a checkbox to the advanced settings to include ceasefire proposal withdrawals in the Kindgom Relations section.
