---
id: scr-4sbd
status: open
deps: []
links: []
created: 2026-04-17T00:32:35Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Early indications show that our operation was a succ..."

Unrecognized line reported 3 time(s) in context: kingdom-news.

Example line:
  Early indications show that our operation was a success. Our thieves were able to release 396 horses but could only bring back 198 of them. (Tikismash PhD (3:11), sent 2000)

Normalised pattern:
  Early indications show that our operation was a success. Our thieves were able to release N horses but could only bring back N of them. (PROVINCE (K:K), sent N)

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

