---
id: Uto-ttpb
status: closed
deps: []
links: []
created: 2026-02-28T18:26:16Z
type: task
priority: 2
assignee: Jamie Walls
---
# Kingdom News: Kingdom Relations section

Move ceasefire and war-related events out of the Own Kingdom Summary block and into a dedicated `** Kingdom Relations **` section in the Kingdom News output.

## Current behaviour

- `-- Ceasefire Proposals Received: N` and `-- Ceasefire Withdrawals Made: N` are emitted inside the `** Own Kingdom Summary **` block.
- They are filtered by `showCeasefireProposals` / `showCeasefireWithdrawals` boolean flags in `applyKingdomNewsSettings` Step 1 (line-level filter on the raw output string).
- War declarations (`'declared WAR'`) and post-war period lines are detected by `detectWarPeriods()` as sentinels only — they are not surfaced in the output at all.

## Desired behaviour

A new `** Kingdom Relations **` block appears at the end of the Kingdom News output (after all other sections). It is **off by default** and is the **last entry** in the show/hide section list.

The block contains:

```
** Kingdom Relations **

-- Ceasefire Proposals Received: N
-- Ceasefire Withdrawals Made: N
-- War Declarations: N         (kingdoms that declared war on us during the log period)
-- War Outcomes: N wins, N losses, N draws
```

Only lines with a non-zero value are emitted.

## Implementation steps

### 1. parser.js — data model

Add to the data initialisation object in `parseKingdomNewsLog`:

```javascript
warDeclarations: [],   // { kingdom, date } for each "declared WAR on us" line
```

(War outcomes are already tracked via `parseSpecialLine` and the `** War Outcomes **` block.)

### 2. parser.js — populate warDeclarations

In the main line-parsing loop, detect `'declared WAR'` lines (currently used only as sentinels in `detectWarPeriods`) and push to `data.warDeclarations`.

### 3. parser.js — emit Kingdom Relations block

At the end of `formatKingdomNewsOutput`, append a `** Kingdom Relations **` block containing:

- `-- Ceasefire Proposals Received: N` (if > 0)
- `-- Ceasefire Withdrawals Made: N` (if > 0)
- `-- War Declarations: N` (if > 0, using `data.warDeclarations.length`)
- `-- War Outcomes: …` formatted from existing war outcome data (if any war data present)

Remove the ceasefire lines from the Own Kingdom Summary block.

### 4. ui.js — section order & visibility

In `advSettings.kingdomNews`:

- Add `'Kingdom Relations'` as the **last** entry in `sectionOrder`.
- Add `'Kingdom Relations': false` to `visible` (off by default).
- Remove `showCeasefireProposals` and `showCeasefireWithdrawals` keys from `advSettings.kingdomNews`.

### 5. ui.js — applyKingdomNewsSettings

- In `getCategory()`, add a case that matches `** Kingdom Relations **` blocks.
- Remove the Step 1 line-level filter for `showCeasefireProposals` / `showCeasefireWithdrawals`.
- Remove rendering of those two checkboxes from `renderKingdomNewsSettings`.

## Acceptance criteria

- `** Kingdom Relations **` block appears last in output when enabled.
- Block is hidden by default; enabling via Advanced Settings shows it.
- Ceasefire proposals, ceasefire withdrawals, war declarations, and war outcomes are all present in the block (non-zero lines only).
- Ceasefire lines no longer appear inside Own Kingdom Summary.
- The old `showCeasefireProposals` / `showCeasefireWithdrawals` checkboxes are gone.
- All existing tests continue to pass.
