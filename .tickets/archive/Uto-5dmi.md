---
id: Uto-5dmi
status: closed
deps: []
links: []
created: 2026-02-27T20:29:38Z
type: feature
priority: 2
tags: [parser, province-logs]
---
# Province Logs parser: handle "You have given orders to commence work on N guilds."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  You have given orders to commence work on 13 guilds.

Normalised pattern:
  You have given orders to commence work on N guilds.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

The province logs parser should handle this line format and should keep track of the number of each type of building being built.  The types of buildings are:
- Guilds
- Homes
- Hospitals
- Libraries
- Mills
- Training Grounds
- Military Barracks
- Castles
- Thieves' Dens
- Stables
- Farms
- Banks
- Armouries
- Forts
- Towers
- Watch Towers
- Dungeons

Only include a building type in the summary output if it is being built.  If no buildings are being built, the output should be empty.

Also include in the advanced settings a toggle of whether to include the building summary in the output or not.
