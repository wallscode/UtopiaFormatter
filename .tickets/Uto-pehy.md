---
id: Uto-pehy
status: closed
deps: []
links: []
created: 2026-11-20T01:22:21Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "DNE strikes! N soldiers at home fall to tooth and claw."

Unrecognized line reported 2 time(s) in context: province-news.

Example line:
  D1E strikes! 998 soldiers at home fall to tooth and claw.

Normalised pattern:
  DNE strikes! N soldiers at home fall to tooth and claw.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.


## Notes

**2026-11-20T01:45:07Z**

Resolved — see commit; test added with the exact game text.
