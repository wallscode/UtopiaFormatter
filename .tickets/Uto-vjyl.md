---
id: Uto-vjyl
status: open
deps: [Uto-uv71]
links: []
created: 2026-02-28T20:00:09Z
type: task
priority: 2
assignee: Jamie Walls
---
# Province Logs: indent detail lines under section headings

Add 2-space indentation to all detail lines under each section heading in the Province Logs output, matching the same approach being applied to Province News in Uto-uv71.

## Current format (all detail lines flush-left)

```
Thievery Summary:
5 Arson for a total of 2 acres
3 Bribe Generals ops
Propaganda:
 100 elites
 50 soldiers
2 failed thievery attempts (1 thieves lost)

Resources Stolen:
12,345 gold coins stolen (3 ops Avg: 4k)
890 runes stolen

Spell Summary:
4 Pitfalls for a total of 14 days
2 Greed for a total of 8 days

Aid Summary:
50,000 gold coins
1,200 runes

Dragon Summary:
25,000 gold coins donated
500 troops sent and weakened by 1,200 points

Construction Summary:
10 farms
5 guilds
2 towers razed

Science Summary:
5,000 books to BOOKKEEPING
3,000 books to TOOLS

Exploration Summary:
150 acres explored
3,000 soldiers sent at a cost of 45,000 gold coins

Military Training:
500 Archers
200 Elf Lords released
Draft: 15% of population
Draft rate: Normal
Military wages: 100%
```

## Target format (2-space indent on detail lines)

```
Thievery Summary:
  5 Arson for a total of 2 acres
  3 Bribe Generals ops
  Propaganda:
    100 elites
    50 soldiers
  2 failed thievery attempts (1 thieves lost)

Resources Stolen:
  12,345 gold coins stolen (3 ops Avg: 4k)
  890 runes stolen

Spell Summary:
  4 Pitfalls for a total of 14 days
  2 Greed for a total of 8 days

Aid Summary:
  50,000 gold coins
  1,200 runes

Dragon Summary:
  25,000 gold coins donated
  500 troops sent and weakened by 1,200 points

Construction Summary:
  10 farms
  5 guilds
  2 towers razed

Science Summary:
  5,000 books to BOOKKEEPING
  3,000 books to TOOLS

Exploration Summary:
  150 acres explored
  3,000 soldiers sent at a cost of 45,000 gold coins

Military Training:
  500 Archers
  200 Elf Lords released
  Draft: 15% of population
  Draft rate: Normal
  Military wages: 100%
```

## Implementation

All changes are in `formatProvinceLogs` in `js/parser.js` (lines ~787–955). Prefix every `output +=` detail line with `  ` (2 spaces). Specific callouts:

### Thievery Summary
- All op lines (`${count} ${name}...`) → `  ${count} ${name}...`
- Steal War Horses line → `  ${stealHorsesOps} Steal War Horses...`
- Failed thievery line → `  ${failedThieveryCount} failed...`
- Thieves lost in successful ops line → `  ${formatNumber(successThiervesLostCount)} thieves lost...`

### Propaganda (sub-section within Thievery Summary)
- `Propaganda:\n` itself → `  Propaganda:\n` (2-space, it's a detail item under Thievery Summary)
- Troop breakdown lines (currently 1-space prefix) → `    ${pCount} ${pName}\n` (4-space, sub-items under Propaganda)

### Resources Stolen
- All stolen resource lines → `  ${formatNumber(...)} ... stolen...\n`

### Spell Summary
- All spell lines → `  ${count} ${spell.name}...\n`

### Aid Summary
- All resource lines → `  ${formatNumber(total)} ${resource}\n`

### Dragon Summary
- Gold donated → `  ${formatNumber(dragonGoldDonated)} gold coins donated\n`
- Bushels donated → `  ${formatNumber(dragonBushelsDonated)} bushels donated\n`
- Troops sent → `  ${formatNumber(dragonTroopsTotal)} troops sent...\n`

### Ritual Summary
- Ritual casts line → `  ${ritualCasts} successful ritual casts\n`

### Construction Summary
- Built lines → `  ${formatNumber(constructionCounts[b])} ${b}\n`
- Razed lines → `  ${formatNumber(razedCounts[b])} ${b} razed\n`

### Science Summary
- Science lines → `  ${formatNumber(scienceCounts[s])} books to ${s}\n`

### Exploration Summary
- Acres explored → `  ${formatNumber(exploreAcres)} acres explored\n`
- Soldiers sent → `  ${formatNumber(exploreSoldiers)} soldiers sent...\n`

### Military Training
- Training lines → `  ${formatNumber(count)} ${unit}\n`
- Release lines → `  ${formatNumber(count)} ${unit} released\n`
- Draft percent → `  Draft: ${draftPercent}% of population\n`
- Draft rate → `  Draft rate: ${draftRate}\n`
- Military wages → `  Military wages: ${militaryWagesPercent}%\n`

## applyProvinceLogsSettings — no changes needed

Section detection in `applyProvinceLogsSettings` (`js/ui.js`) uses `text.indexOf('\n\n' + name + ':')` to locate section headings, which remain flush-left. Indented detail lines are not affected. There is no `startsWith('  ')` filtering in Province Logs settings (unlike Province News), so no stripping logic needs updating.

## Tests

Run `tests/province-logs.test.js` after the change. The existing tests use substring matching and likely pass unchanged, but verify the full suite passes.
