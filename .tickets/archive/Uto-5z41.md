---
id: Uto-5z41
status: closed
deps: []
links: []
created: 2026-03-03T00:52:53Z
type: feature
priority: 2
assignee: Jamie Walls
---
# Province Logs: Science Summary grouped by category with display names and descriptions

Update the Science Summary section in Province Logs to:
1. Display sciences grouped under three category headers: Economy, Military, Arcane Arts (in that order)
2. Use title-case display names instead of the current all-uppercase keys (e.g. 'Alchemy' not 'ALCHEMY')
3. Append a parenthetical description after each science name (e.g. 'Alchemy (Income)')
4. Within each group, sort by books descending (same as current sort)
5. Omit a group header entirely if none of its sciences have any books

Current output example:
  196,560 books to CRIME
  103,480 books to BOOKKEEPING

New output example:
  Economy:
    103,480 books to Bookkeeping (Wages)
  Arcane Arts:
    196,560 books to Crime (TPA)

Science-to-group and description mapping:
  Economy: Alchemy (Income), Tools (Building Efficiency), Housing (Population), Production (Food & Runes), Bookkeeping (Wages), Artisan (Construction)
  Military: Strategy (Defense), Siege (Battle Gains), Tactics (Offense), Valor (Train Time & Drag Slaying), Heroism (Draft Speed & Cost), Resilience (Military Casualties)
  Arcane Arts: Crime (TPA), Channeling (WPA), Shielding (Damage Reduction), Cunning (Thievery Op Damage), Sorcery (Magic Spell Damage), Finesse (Reduced Losses)

## Design

**Config change in parser.js:**
Replace the flat SCIENCES array with a structured config that encodes display name, description, and group membership. Add a new SCIENCE_GROUPS constant (or replace SCIENCES) like:

  SCIENCE_GROUPS: [
    { group: 'Economy', sciences: [
      { key: 'ALCHEMY',    display: 'Alchemy',    desc: 'Income' },
      { key: 'TOOLS',      display: 'Tools',      desc: 'Building Efficiency' },
      { key: 'HOUSING',    display: 'Housing',    desc: 'Population' },
      { key: 'PRODUCTION', display: 'Production', desc: 'Food & Runes' },
      { key: 'BOOKKEEPING',display: 'Bookkeeping',desc: 'Wages' },
      { key: 'ARTISAN',    display: 'Artisan',    desc: 'Construction' },
    ]},
    { group: 'Military', sciences: [
      { key: 'STRATEGY',   display: 'Strategy',   desc: 'Defense' },
      { key: 'SIEGE',      display: 'Siege',      desc: 'Battle Gains' },
      { key: 'TACTICS',    display: 'Tactics',    desc: 'Offense' },
      { key: 'VALOR',      display: 'Valor',      desc: 'Train Time & Drag Slaying' },
      { key: 'HEROISM',    display: 'Heroism',    desc: 'Draft Speed & Cost' },
      { key: 'RESILIENCE', display: 'Resilience', desc: 'Military Casualties' },
    ]},
    { group: 'Arcane Arts', sciences: [
      { key: 'CRIME',      display: 'Crime',      desc: 'TPA' },
      { key: 'CHANNELING', display: 'Channeling', desc: 'WPA' },
      { key: 'SHIELDING',  display: 'Shielding',  desc: 'Damage Reduction' },
      { key: 'CUNNING',    display: 'Cunning',    desc: 'Thievery Op Damage' },
      { key: 'SORCERY',    display: 'Sorcery',    desc: 'Magic Spell Damage' },
      { key: 'FINESSE',    display: 'Finesse',    desc: 'Reduced Losses' },
    ]},
  ]

Keep the flat SCIENCES array (derived from SCIENCE_GROUPS) for use in parsing — the uppercase key matching at line 832 must stay unchanged.

**Initialization (line 550):**
Derive keys from SCIENCE_GROUPS for scienceCounts initialization instead of using the flat array.

**Output block (lines 1024-1031):**
Replace the current flat sort-and-print loop with a grouped loop:
  for each group in SCIENCE_GROUPS:
    filter to sciences with count > 0
    if none, skip group entirely
    emit '  GroupName:\n'
    sort by count desc
    for each science: emit '    N books to DisplayName (Desc)\n' (4-space indent)

**Thievery by Op Type / Spell by Spell Type sections:**
These sections in the output reference science groupings indirectly via the Spy on Sciences operation — no change needed there.

**applyProvinceLogsSettings (ui.js):**
No changes needed — Science Summary visibility and ordering is already handled by the section name key 'Science Summary'.

## Acceptance Criteria

- [ ] Science Summary output uses three group headers (Economy, Military, Arcane Arts)
- [ ] Groups with no books are omitted
- [ ] Within each group, sciences sorted by books descending
- [ ] Each science line uses title-case display name and parenthetical description
- [ ] Sciences with zero books are omitted (same as today)
- [ ] Parsing still correctly matches uppercase science keys from log text
- [ ] Expected output file updated
- [ ] All tests pass

