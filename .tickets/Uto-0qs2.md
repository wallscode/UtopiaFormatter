---
id: Uto-0qs2
status: open
deps: []
links: []
created: 2026-02-25T03:27:06Z
type: bug
priority: 1
tags: [parser, kingdom-news]
---
# Kingdom News parser: own kingdom is hardcoded to 5:1

The parser hardcodes the own kingdom identifier to `'5:1'` in two places in `js/parser.js`:

- `parseSpecialLine` (line ~897): `data.ownKingdomId = '5:1'; // Assuming this is the own kingdom`
- `formatKingdomNewsOutput` (line ~1015): `const ownKingdomId = data.ownKingdomId || '5:1';`

This means the parser produces correct output only for kingdom 5:1. Any other kingdom will have its attacks attributed to the wrong side of the summary (Made vs Suffered), and the "Own Kingdom" section will either be empty or show the wrong kingdom's data.

## Required behaviour

The parser must dynamically determine the own kingdom from the text itself. The own kingdom is the one from whose perspective the news was copied — it is the kingdom that appears on both sides of the news (as attacker in outbound attacks and as defender in inbound attacks). It will typically be the most frequently referenced kingdom across all attack lines.

## Suggested detection approach

After parsing all attack lines, count how many times each kingdom_id appears as either attacker or defender. The kingdom with the highest combined frequency is the own kingdom. As a tie-breaker, the own kingdom is more likely to appear in the defender role in inbound attack lines (the "invaded X and captured" format), since enemy kingdoms only appear in lines specific to attacks against us.

## Acceptance Criteria

- Own kingdom is determined from the input text, not hardcoded
- `UNIQUE_WINDOW_DAYS` constant and all `data.ownKingdomId === x` comparisons continue to work correctly with the dynamically determined value
- Parser produces correct output for kingdoms with IDs other than 5:1
- Existing tests pass; new test added with a kingdom other than 5:1
