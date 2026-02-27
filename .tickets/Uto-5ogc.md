---
id: Uto-5ogc
status: closed
deps: []
links: []
created: 2026-02-27T20:29:02Z
type: feature
priority: 2
tags: [parser, province-logs]
---
# Province Logs parser: handle "Sources have indicated the mission was foiled. We lo..."

Unrecognized line reported 2 time(s) in context: province-logs.

Example line:
  Sources have indicated the mission was foiled. We lost 2 thieves. If we are lucky, they will not rat on who sent them. I am sorry, we will train harder for the next mission. (The Orc bobsled team (3:7), sent 99)

Normalised pattern:
  Sources have indicated the mission was foiled. We lost N thieves. If we are lucky, they will not rat on who sent them. I am sorry, we will train harder for the next mission. (The Orc bobsled team (K:K), sent N)

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This event should count as a failed thievery attempt and the summary should include the total count of failed thievery attempts as well as a count of thieves lost total in failed thievery attempts.

The advanced settings should include a toggle for whether to include failed thievery attempts in the summary or not.

