---
id: Uto-yxl8
status: closed
deps: []
links: []
created: 2026-03-08T13:27:19Z
type: task
priority: 2
assignee: Jamie Walls
---
# Merge Ritual Coverage into Rituals Started/Completed toggle

The game has no 'Our ritual [name] has been completed!' event and no enemy rituals cast on our kingdom. The only ritual completion event is 'A ritual is covering our lands! (Haste)', which means OUR ritual was successfully completed. The current parser incorrectly models this as enemy ritual coverage and tracks it separately from ritualsStarted/ritualsCompleted. The ritualCoverage data (including ritual type names) should be unified under the showRituals toggle and the showRitualCoverage toggle removed entirely.

## Acceptance Criteria

- The 'A ritual is covering our lands! (Haste)' line is parsed as a ritual completion (incrementing ritualsCompleted and recording the ritual type name)
- The separate ritualCoverage array and showRitualCoverage toggle are removed
- Ritual completion output under Own Kingdom Summary includes the ritual type (e.g. '-- Rituals Completed: 2 (Haste, Storm)') controlled by showRituals
- The '-- Ritual Coverage: N (...)' output line is removed
- showRitualCoverage is removed from advSettings.kingdomNews defaults and from the checkboxGroups in renderKingdomNewsSettings
- Tests updated to reflect new output format

