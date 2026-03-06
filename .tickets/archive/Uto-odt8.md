---
id: Uto-odt8
status: closed
deps: []
links: []
created: 2026-03-05T01:47:54Z
type: task
priority: 2
assignee: Jamie Walls
---
# Fix Lightning Strike rune count: spell cost matched instead of runes incinerated

The Province Logs spell impact extractor uses a generic regex:

    line.match(new RegExp(`([\\d,]+)\\s+${escapeRegExp(spell.impact)}`, 'i'))

For Lightning Strike (impact: 'runes') this matches the FIRST occurrence of 'N runes' in the line. But the line format is:

    Your wizards gather 4,111 runes and begin casting, and the spell succeeds. Lightning strikes the Towers in Province (K:K) and incinerates 28,313 runes! (Province (K:K))

The first 'runes' is the spell cost (4,111), not the impact (28,313). The fix is to use a specific regex for Lightning Strike that matches 'incinerates N runes' instead of the generic pattern.

Fix location: accumulateProvinceLogsData in parser.js, inside the SPELLS loop (~line 599). Add a special-case for Lightning Strike before the generic regex, or use a named regex per spell entry similar to how Tornadoes uses 'acres of buildings'.

## Acceptance Criteria

1. Lightning Strike spell impact in the Spell Summary shows runes incinerated (the larger number), not runes gathered (the spell cost). 2. All existing test suites pass.

