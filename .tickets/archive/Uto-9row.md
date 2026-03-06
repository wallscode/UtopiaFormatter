---
id: Uto-9row
status: closed
deps: []
links: []
created: 2026-02-28T13:33:45Z
type: feature
priority: 2
tags: [parser, province-logs, province-news, thievery]
assignee: Jamie Walls
---
# Thievery: add espionage op tracking in Province Logs and sabotage impacts in Province News

## Reference

Wiki source: https://wiki.utopia-game.com/index.php?title=Thievery

---

## Part 1 — Province Logs: Espionage Operations (new)

Espionage ops are intelligence-gathering missions we run against enemy provinces. They appear in Province Logs as success confirmations. All 8 are currently unhandled — their log text is unknown.

Add a new `ESPIONAGE_OPS` config list (or a section in `OPERATIONS` flagged `espionage: true`) and a new **Espionage Summary** section in Province Logs output, **hidden by default**, with an Advanced Settings toggle. Track op count only — no resource impact to measure.

### Operations to add (log text unknown — all placeholders)

| Operation | Description |
|---|---|
| Spy on Throne | Estimates enemy resources and troops |
| Spy on Defense | Reveals net defensive points |
| Spy on Exploration | Discloses enemy explore pool and costs |
| Snatch News | Displays enemy kingdom newspaper |
| Infiltrate | Estimates enemy thief count |
| Survey | Reports enemy building distribution |
| Spy on Military | Shows deployed and training troops |
| Spy on Sciences | Estimates enemy science bonuses |

Add sentinel exclusions to suppress unrecognized-line logging once each pattern is identified from real log data.

---

## Part 2 — Province Logs: Sabotage Operations (already complete)

All 16 sabotage operations are already tracked in Province Logs. No work needed here.

| Operation | Status |
|---|---|
| Arson | ✓ OPERATIONS config |
| Greater Arson | ✓ greaterArsonBuildingCounts |
| Assassinate Wizards | ✓ OPERATIONS config |
| Bribe Generals | ✓ OPERATIONS config |
| Bribe Thieves | ✓ OPERATIONS config |
| Destabilize Guilds | ✓ OPERATIONS config |
| Free Prisoners | ✓ OPERATIONS config |
| Incite Riots | ✓ OPERATIONS config |
| Kidnapping | ✓ OPERATIONS config |
| Night Strike | ✓ OPERATIONS config |
| Propaganda | ✓ OPERATIONS config |
| Rob the Granaries | ✓ granaryRobberyCount + bushelsStolen |
| Rob the Vaults | ✓ vaultRobberyCount + goldCoinsStolen |
| Rob the Towers | ✓ towerRobberyCount + runesStolen |
| Sabotage Wizards | ✓ OPERATIONS config |
| Steal War Horses | ✓ stealHorsesOps |

---

## Part 3 — Province News: Sabotage Impacts on Us

When an enemy runs a sabotage op on our province, it may appear in Province News. Currently 5 of 16 are handled.

### Already handled

| Operation | Province News handler |
|---|---|
| Incite Riots | `rioting` — count + days ✓ |
| Sabotage Wizards | `manaDis` — count + days ✓ |
| Propaganda | `desertions`, `failedPropaganda`, `turncoatGenerals` ✓ |
| Rob the Vaults | `stolen.gold` ✓ |
| Rob the Towers | `stolen.runes` ✓ |

### Missing — need Province News handlers

Add to `data` init in `parseProvinceNews` and add handlers in `parseProvinceNewsLine`. All log text is unknown — use placeholder approach (match on keyword, log unrecognized line until pattern is confirmed).

| Operation | Impact to measure | Notes |
|---|---|---|
| Rob the Granaries | bushels stolen | Add `stolen.bushels: 0` to data init; event text likely mirrors gold/rune patterns |
| Steal War Horses | war horses stolen | Add `stolen.warHorses: 0` to data init |
| Night Strike | soldiers killed | Unknown event text |
| Assassinate Wizards | wizards killed | Unknown event text |
| Arson | buildings/acres destroyed | Unknown event text |
| Greater Arson | targeted buildings destroyed | Rogues only; unknown event text |
| Destabilize Guilds | spell duration reduced (days) | Unknown event text |
| Free Prisoners | prisoners released | Unknown if generates Province News event |
| Kidnapping | peasants stolen | Unknown event text |
| Bribe Generals | troop loss increase | Unknown if generates visible Province News event |
| Bribe Thieves | thief effectiveness reduction | Unknown if generates visible Province News event |

Note: Bribe Generals and Bribe Thieves may not generate discrete Province News events since their effects are passive modifiers. Confirm from real log data.

### Output

Surface new sabotage impact counts in the **Thievery Impacts** section of Province News (currently being restructured by Uto-l42y). Update `data.stolen` to include `bushels` and `warHorses` and add them to the Resources Stolen section output.

---

## Implementation touch points

- `js/parser.js` — `PROVINCE_LOGS_CONFIG`: add `ESPIONAGE_OPS` list
- `js/parser.js` — `formatProvinceLogs`: add espionage op parse loop; add Espionage Summary section
- `js/parser.js` — `parseProvinceNews` data init: add `stolen.bushels`, `stolen.warHorses`, and fields for each new sabotage impact type
- `js/parser.js` — `parseProvinceNewsLine`: add handlers for each newly tracked impact
- `js/parser.js` — `formatProvinceNewsOutput`: add new stolen resources and thievery impact lines
- `js/ui.js` — `advSettings.provinceLogs`: add `showEspionageSummary: false` toggle
- `js/ui.js` — `renderProvinceLogsSettings`: add checkbox for Espionage Summary
