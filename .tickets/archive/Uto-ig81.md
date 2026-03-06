---
id: Uto-ig81
status: closed
deps: []
links: []
created: 2026-02-28T12:58:11Z
type: bug
priority: 2
tags: [output, parser, pluralization]
assignee: Jamie Walls
---
# Output: replace occurrence(s) with correctly pluralized occurrence/occurrences

## Problem

Three lines in `formatProvinceNewsOutput` use the lazy `occurrence(s)` shorthand instead of proper pluralization:

| Line | File | ~Line # |
|---|---|---|
| `Incite Riots: N occurrence(s), hampering tax for N days` | parser.js | 2227 |
| `Sabotage Wizards: N occurrence(s), disrupting mana for N days` | parser.js | 2229 |
| `Pitfalls: N occurrence(s)` | parser.js | 2287 |

A 4th instance will be added by Uto-ccjb (Greed line). That ticket should use the correct pattern from the start, or be updated once this ticket is implemented first.

## Fix

Add a small helper in `parser.js` (near the other helpers at the top of the file):

```javascript
function pluralize(n, word) {
    return n === 1 ? `${n} ${word}` : `${n} ${word}s`;
}
```

Replace each `occurrence(s)` with `${pluralize(count, 'occurrence')}`:

```
Incite Riots: 1 occurrence, hampering tax for 14 days
Incite Riots: 3 occurrences, hampering tax for 42 days
```

## Scope

Only fix user-facing output lines in `parser.js`. The `occurrence(s)` in `scripts/analyze-logs.js` is a developer-only tool and can be updated opportunistically but is not required.
