---
id: Uto-1obo
status: closed
deps: []
links: []
created: 2026-03-03T02:00:32Z
type: feature
priority: 2
assignee: Jamie Walls
---
# Province Logs: rename sections and toggle labels for clarity

Rename five section headings (in parser output, advSettings keys, sectionOrder, visible map, applyProvinceLogsSettings sectionNames, and expected output file) and four toggle labels (UI only).

Section renames (output + UI):
  'Thievery Targets'    → 'Thievery Targets by Province'
  'Thievery by Op Type' → 'Thievery Targets by Op Type'
  'Resources Stolen'    → 'Resources Stolen from Opponents'
  'Spell Targets'       → 'Spell Targets by Province'
  'Spell by Spell Type' → 'Spell Targets by Spell Type'

Toggle label renames (UI text only, no advSettings key or output change):
  'Show draft percentage'  → 'Show draft percentage changes'
  'Show draft rate setting'→ 'Show draft rate changes'
  'Show military wages'    → 'Show military wage changes'
  'Copy for Discord'       → 'Show Copy for Discord button'   (Province Logs only — do NOT change Province News)

## Design

**parser.js — output section header strings:**
  Line ~975:  '\nResources Stolen:\n'          → '\nResources Stolen from Opponents:\n'
  Line ~1094: '\nThievery Targets:\n'           → '\nThievery Targets by Province:\n'
  Line ~1149: '\nSpell Targets:\n'              → '\nSpell Targets by Province:\n'
  Line ~1186: '\nThievery by Op Type:\n'        → '\nThievery Targets by Op Type:\n'
  Line ~1257: '\nSpell by Spell Type:\n'        → '\nSpell Targets by Spell Type:\n'

**ui.js — advSettings.provinceLogs (~line 33–52):**
  sectionOrder array: update all five string values
  sectionGroups children arrays (lines 35–36): update all five
  visible object keys (lines 47–52): update all five

**ui.js — applyProvinceLogsSettings sectionNames array (~line 1306–1308):**
  Update all five strings.

**ui.js — renderProvinceLogsSettings toggle labels:**
  Line ~1086: ' Show draft percentage'    → ' Show draft percentage changes'
  Line ~1106: ' Show draft rate setting'  → ' Show draft rate changes'
  Line ~1126: ' Show military wages'      → ' Show military wage changes'
  Line ~1151: ' Copy for Discord'         → ' Show Copy for Discord button'

**tests/provincelogs_expected_output.txt:**
  Line 27:  'Resources Stolen:'          → 'Resources Stolen from Opponents:'
  Line 109: 'Thievery Targets:'          → 'Thievery Targets by Province:'
  Line 210: 'Spell Targets:'             → 'Spell Targets by Province:'
  Line 372: 'Thievery by Op Type:'       → 'Thievery Targets by Op Type:'
  Line 460: 'Spell by Spell Type:'       → 'Spell Targets by Spell Type:'

**tests/province-logs.test.js:**
  Component validation assertion (~line 148–149): 'Resources Stolen:' → 'Resources Stolen from Opponents:'
  Value assertion indexOf/includes calls (~lines 357–385): update all five section name strings
  resetSettings sectionOrder (~line 419): update all five
  resetSettings visible keys (~line 420): update all five
  Synth input section headers (~lines 443–465): update 'Thievery Targets:', 'Thievery by Op Type:', 'Spell Targets:', 'Spell by Spell Type:' where present
  Any showFailedThievery/showFailedSpellAttempts assertions that reference section names

## Acceptance Criteria

- [ ] All five section headings updated consistently across parser.js, ui.js, expected output, and tests
- [ ] Four toggle labels updated in UI only (advSettings keys unchanged)
- [ ] Province News 'Copy for Discord' label unchanged
- [ ] All tests pass

