---
id: Uto-aq8g
status: closed
deps: []
links: []
created: 2026-03-11T21:30:00Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "Blizzards are besetting our works, and our building ..."

Unrecognized line reported 2 time(s) in context: province-news.

Example line:
  Blizzards are besetting our works, and our building efficiency will be crippled by 10% for for 8 days!

Normalised pattern:
  Blizzards are besetting our works, and our building efficiency will be crippled by 10% for for N days!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

The name of this spell is Blizzards and this is the indication that another province has cast it upon us.  It will always be for 10% efficiency reduction but the number of days can vary.

