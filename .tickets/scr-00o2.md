---
id: scr-00o2
status: closed
deps: []
links: []
created: 2026-05-04T11:16:19Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "N,N men deserted our military due to housing shortag..."

Unrecognized line reported 1 time(s) in context: province-news.

Example line:
  3,034 men deserted our military due to housing shortages! This included 0 soldiers, 1,450 elites, 494 offensive specialists, 616 defensive specialists and 474 thieves.

Normalised pattern:
  N,N men deserted our military due to housing shortages! This included N soldiers, N,N elites, N offensive specialists, N defensive specialists and N thieves.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is a military desertion event that should be tracked in the military section of the province report.  It should track the total number of men that deserted, and break down the types of men that deserted.  It can be called "Military Desertion due to Overpop". All numbers in this could be comma separated so make sure it supports that.  The example given only had a few that were comma separated, but it could be more.

