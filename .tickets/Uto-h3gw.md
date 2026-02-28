---
id: Uto-h3gw
status: closed
deps: []
links: []
created: 2026-02-28T13:21:16Z
type: feature
priority: 2
tags: [parser, province-logs, province-news, spells]
assignee: Jamie Walls
---
# Spells: add full self-spell tracking in Province Logs and offensive spell impacts in Province News

## Reference

Wiki source: https://wiki.utopia-game.com/index.php?title=Mystics

---

## Part 1 — Province Logs: Self Spells

Self spells are spells cast by us on our own province. They appear in Province Logs as cast confirmations. Currently the parser tracks zero self spells.

Add a new `SELF_SPELLS` config list and a new "Self Spells Cast" section to Province Logs output (hidden by default, toggle in Advanced Settings). The exact log text for each spell is unknown — it must be discovered by running real log data through the unrecognized-line logger.

### Self spells to support (35 total from wiki)

For each spell below, add a sentinel exclusion to suppress the "unrecognized line" log once the cast-confirmation text is identified, and add a counter entry. Spells marked **placeholder** are ones where the log text is unknown — add an exclusion stub with a `// TODO: identify log text` comment once seen in the wild.

**Defensive/Protection:**
- Divine Shield, Greater Protection, Magic Shield, Minor Protection, Mist, Nature's Blessing, Reflect Magic, Shadowlight

**Army/Combat:**
- Aggression, Animate Dead, Bloodlust, Fanaticism, Inspire Army, Mage's Fury, Patriotism, Quick Feet, Righteous Aggressor, Salvation, War Spoils, Wrath

**Thievery-Related:**
- Clear Sight, Illuminate Shadows, Invisibility, Town Watch

**Economic/Production:**
- Builders' Boon, Fertile Lands, Fountain of Knowledge, Love & Peace, Mind Focus, Miner's Mystique, Paradise, Tree of Gold

**Utility:**
- Anonymity, Guile, Revelation

All 35 are placeholders until real log text is observed. Prioritize once unrecognized lines containing spell names appear in the log analysis tool output.

---

## Part 2 — Province Logs: Offensive Spells (cast by us on enemies)

22 of 24 offensive spells are already handled in `PROVINCE_LOGS_CONFIG.SPELLS`. Two are missing:

| Spell | Effect | Status |
|---|---|---|
| Crystal Ball | Reveals enemy throne page | Placeholder — log text unknown |
| Crystal Eye | Shows enemy kingdom paper | Placeholder — log text unknown |

Add placeholder entries for both. Since these are intelligence spells, the log text is likely something like "We have successfully used Crystal Ball on..." — confirm from real log data.

---

## Part 3 — Province News: Offensive Spell Impacts (cast on us by enemies)

When an enemy casts an offensive spell on our province, it appears in Province News. Currently only Meteor Showers and Pitfalls are parsed (in Magic Impacts). Greed is being added by Uto-ccjb. All other offensive spells are unhandled.

The exact Province News event text for most spells is unknown. The approach:
1. Add placeholder handlers that match on the spell name keyword
2. Increment a count and accumulate numeric impact where extractable
3. Add sentinel exclusions to suppress unrecognized-line logging once the pattern is confirmed
4. Surface counts in the Spell Impacts section (being restructured by Uto-l42y)

### Already handled in Province News

| Spell | Handler |
|---|---|
| Meteor Showers | ✓ casualties + days tracked |
| Pitfalls | ✓ count tracked (days not stored — see Uto-v63f note) |
| Greed | ✓ via Uto-ccjb |

### Need Province News handlers (log text unknown — placeholders)

| Spell | Effect to measure |
|---|---|
| Fireball | peasants killed |
| Lightning Strike | runes destroyed |
| Tornadoes | acres of buildings destroyed |
| Fool's Gold | gold destroyed |
| Vermin | bushels destroyed |
| Chastity | days duration |
| Nightmares | troops returned to training |
| Blizzard | days duration |
| Droughts | days duration |
| Storms | days duration |
| Abolish Ritual | count of casts |
| Amnesia | books destroyed |
| Magic Ward | days duration |
| Mystic Vortex | active spells nullified |
| Nightfall | days duration |
| Explosions | days duration |
| Expose Thieves | days duration |
| Land Lust | acres taken |
| Crystal Ball | count (intelligence only) |
| Crystal Eye | count (intelligence only) |

---

## Implementation notes

- All new Province News spell impact lines should be added to `parseProvinceNewsLine` before the `logUnrecognizedLine` catch-all.
- All new Province Logs self spell confirmations should be added to the main parse loop in `formatProvinceLogs` with sentinel exclusions.
- This ticket covers the structure and placeholders. Actual log-text patterns should be filled in as they are confirmed from real data via the unrecognized-line log analysis tool.
- New Province News spell data fields should be added to the `data` init in `parseProvinceNews`.
