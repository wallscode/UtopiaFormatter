---
id: Uto-mw8w
status: closed
deps: []
links: []
created: 2026-03-04T12:31:17Z
type: task
priority: 2
assignee: Jamie Walls
---
# Code consistency review and comment pass

Audit all JS source files for naming inconsistencies, structural inconsistencies across the three parsers, and missing documentation. Fix everything that is inconsistent without functional reason, and add comments throughout. Scope: parser.js, ui.js, main.js. logsparse.js is excluded (pending deletion in Uto-szsj).

---

## 1. Naming inconsistencies

### 1a. Abbreviated variable names in Province News parser (parser.js ~2337–2710)
Province News parsing uses heavily abbreviated match variables while Kingdom News and Province Logs use descriptive names.

| Province News (inconsistent) | Kingdom News / Province Logs (consistent) |
|---|---|
| `m` (match — reused 70+ times) | `dateMatch`, `acresOfM`, `spellTargetM` |
| `ev` (event text) | `line` |
| `cs` (casualty string) | `casualtyStr` or similar |
| `peas`, `sol`, `mags`, `bsts` | `peasantsM`, `soldiersM`, etc. |

Fix: rename to descriptive names consistent with the rest of parser.js.

### 1b. Magic numbers in dateToNumber (parser.js ~266–275)
The formula `year * 7 * 24 + monthIdx * 24 + (day - 1)` uses bare `7` and `24`. These are game constants (7 months/year, 24 days/month). They should be named constants defined alongside `UNIQUE_WINDOW_DAYS` at the top of the file:
```
const MONTHS_PER_YEAR = 7;
const DAYS_PER_MONTH  = 24;
```

### 1c. Date regex month-matching inconsistency (parser.js ~326, ~1341, ~2962)
Kingdom News and Province Logs use explicit month name alternation:
```
/^(January|February|March|...|December) \d{1,2} of YR\d+/
```
Province News uses `\w+` for the month field (~line 2962):
```
/^(\w+ \d+ of YR\d+)\t(.+)$/
```
This is inconsistent and could silently accept malformed month names. Align Province News to use the explicit month list, or extract the shared regex into a named constant reused by all three parsers.

---

## 2. Structural inconsistencies across parsers

### 2a. Decorative comment separator style
`parseSpecialLine` (~line 1814) uses Unicode box-drawing separators:
```
// ── Own-kingdom dragon actions ─────────────────────────────────────────
```
`formatKingdomNewsOutput` also uses this style in some sections but not all. `parseProvinceNewsLine` and `formatProvinceLogs` use plain `// ---` or no separators at all. Pick one style and apply consistently throughout.

### 2b. Repeated parseInt/replace pattern (99+ occurrences in parser.js)
Every parser extracts numbers from game text with:
```js
parseInt(someMatch[1].replace(/,/g, ''))
```
Extract this into a small helper at the top of parser.js:
```js
function parseGameInt(str) { return parseInt(str.replace(/,/g, ''), 10); }
```
Replace all inline occurrences. This also fixes the missing radix argument (parseInt without radix 10 is technically a lint warning).

---

## 3. Missing or thin documentation (JSDoc + inline comments)

### 3a. `parseSpecialLine` (parser.js ~1814) — NO JSDoc at all
Despite being ~180 lines handling dragons, rituals, and ceasefire events, this function has no JSDoc block. Add one explaining:
- What the function parses
- Parameters and return value (returns boolean — did it handle the line?)
- Side effects (mutates `provinces` and `kingdoms` via closure)

### 3b. `updateHighlights` (parser.js ~1996) — NO JSDoc, no inline comments
Add JSDoc explaining:
- What highlights are (best attacks/most bounces for own-kingdom provinces)
- Why it only applies to own-kingdom attacker/defender
- What the function mutates

### 3c. `parseProvinceNewsLine` (parser.js ~2337–2710) — JSDoc present but many subsections undocumented
Add brief inline section comments before each major block:
- The land/population events block
- The aid/resource block
- The casualty/combat block
- The magic/thievery received block
- The starvation block

### 3d. `detectOwnKingdom` and `parseText` (parser.js) — verify JSDoc is complete and accurate
Check that the existing JSDoc matches the current implementation (these were changed during bug fixes).

### 3e. `formatProvinceNewsOutput` (parser.js ~2717) — partially documented
Add section comments describing the major output sections (land summary, aid received, thievery received, etc.).

### 3f. ui.js — verify consistent JSDoc across all exported/top-level functions
Quick pass to confirm all functions have JSDoc or clear inline comments. The audit found ui.js is relatively consistent but worth confirming.

---

## 4. Scope notes

- logsparse.js: excluded — targeted for deletion in Uto-szsj.
- Differences between parsers that ARE intentional and should NOT change:
  - Province Logs uses a YR\d+ filter pass; Province News uses a tab-delimited format; Kingdom News scans for a date-line start. All three are different because the input formats are different.
  - Province News uses `pnMonthYear` helper; others use `dateToNumber`. Appropriate specialization.
  - Output format structure differs per parser — intentional.
- Do not change any regex or logic that affects parse output. Run all three test suites before and after each change to verify no regressions.

## Acceptance Criteria

1. All findings above are fixed or explicitly documented as intentional. 2. All three test suites pass: /opt/homebrew/bin/node tests/kingdom-news-log.test.js, /opt/homebrew/bin/node tests/province-logs.test.js, /opt/homebrew/bin/node tests/province-news.test.js. 3. Every non-trivial function in parser.js has a JSDoc block. 4. Changes committed and pushed.

