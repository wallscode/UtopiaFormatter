---
id: scr-e46u
status: closed
deps: []
links: []
created: 2026-05-04T11:15:42Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "Your Dark Elf mystics' mastery of the arcane allows ..."

Unrecognized line reported 7 time(s) in context: province-logs.

Example line:
  Your Dark Elf mystics' mastery of the arcane allows them to recover 130 runes from the spell casting, their magical efficiency preserving precious resources.

Normalised pattern:
  Your Dark Elf mystics' mastery of the arcane allows them to recover N runes from the spell casting, their magical efficiency preserving precious resources.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is a unique capability of the Dark Elf race where they can recover runes from spell casting. It should be parsed and added to the data structure as a rune recovery event. The number of runes recovered should be kept as an optional value to be added in the optional view as a rune recovery event and the total impact of rune recovery, but by default this should be toggled off.

