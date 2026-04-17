---
id: scr-lfdi
status: closed
deps: []
links: []
created: 2026-04-17T10:53:16Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Early indications show that our operation was a succ..."

Unrecognized line reported 39 time(s) in context: kingdom-news.

Example line:
  Early indications show that our operation was a success and we have 100% confidence in the information retrieved. Our report shows that this province has not been attacked much in the last month. Remember, there are few rewards for attacking a badly hit province, as the easily captured resources have already been taken. (Annabeth Chase (3:11), sent 650)

Normalised pattern:
  Early indications show that our operation was a success and we have N% confidence in the information retrieved. Our report shows that this province has not been attacked much in the last month. Remember, there are few rewards for attacking a badly hit province, as the easily captured resources have already been taken. (PROVINCE (K:K), sent N)

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

