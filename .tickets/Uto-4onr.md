---
id: Uto-4onr
status: open
deps: []
links: []
created: 2026-03-01T12:25:08Z
type: task
priority: 2
assignee: Jamie Walls
---
# Kingdom News: merge own/enemy Dragon Cancellations under one setting, default off

## Problem

There are two dragon-cancellation output lines:

| Line | Where it appears | Controlled by |
|---|---|---|
| `-- Dragons Cancelled: N` | Own Kingdom Summary (attacks made section) | Nothing — always shown when N > 0 |
| `-- Enemy Dragons Cancelled: N` | Own Kingdom Summary (attacks suffered section) | `showDragonCancellations` setting |

The `showDragonCancellations` toggle in Advanced Settings is labelled
**"Enemy dragon cancellations"** and defaults to `false`, but it only
suppresses the enemy line. The own kingdom's `-- Dragons Cancelled:` line
has no filter at all — it appears unconditionally whenever the count is
non-zero.

The two lines should be controlled by a single toggle, labelled simply
**"Dragon Cancellations"**, that defaults to **off** and hides both lines
when unchecked.

---

## Current state — `js/ui.js`

```javascript
// advSettings.kingdomNews (~line 16)
showDragonCancellations: false,

// Checkbox list (~line 444)
{ key: 'showDragonCancellations', label: 'Enemy dragon cancellations' },

// applyKingdomNewsSettings filter (~line 1003)
if (!s.showDragonCancellations && /^-- Enemy Dragons Cancelled:/.test(line)) return false;
```

---

## Implementation — `js/ui.js` only, two changes

### 1. Rename the label (~line 444)

```javascript
// Before
{ key: 'showDragonCancellations', label: 'Enemy dragon cancellations' },

// After
{ key: 'showDragonCancellations', label: 'Dragon Cancellations' },
```

### 2. Widen the filter regex to catch both lines (~line 1003)

```javascript
// Before
if (!s.showDragonCancellations && /^-- Enemy Dragons Cancelled:/.test(line)) return false;

// After
if (!s.showDragonCancellations && /^-- (Enemy )?Dragons Cancelled:/.test(line)) return false;
```

The `(Enemy )?` makes the regex match both:
- `-- Dragons Cancelled: N` (own kingdom)
- `-- Enemy Dragons Cancelled: N` (enemy kingdoms)

No parser changes and no `advSettings` default changes are needed —
`showDragonCancellations` already exists and already defaults to `false`.

---

## Tests

No automated test changes are needed. The kingdom-news-log test data does
have a `-- Dragons Cancelled: 1` line in the output, but that line is
currently always shown (no filter). After this change it will be hidden
by default — so the line must be **removed** from
`tests/Kingdom News Report target format.txt`.

Verify the line count drops by one and the test still passes.

Manually verify in the browser:
1. Parse a Kingdom News log that contains own or enemy dragon cancellations.
2. Confirm neither `-- Dragons Cancelled` nor `-- Enemy Dragons Cancelled`
   appears by default.
3. Enable **Dragon Cancellations** in Advanced Settings — confirm both
   lines appear in their respective summaries when the counts are non-zero.

