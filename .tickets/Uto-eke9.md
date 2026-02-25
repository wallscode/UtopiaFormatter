---
id: Uto-eke9
status: closed
deps: []
links: []
created: 2026-02-25T03:19:25Z
type: bug
priority: 1
tags: [parser, kingdom-news, uniques]
---
# Fix uniques calculation in Kingdom News parser

The current "Uniques" count and per-province unique attack list are both wrong. The requirements define unique attacks using a 6-day sliding window, but the parser implements neither the windowing logic nor the per-direction separation.

## Current (broken) behaviour

- `Uniques:` in the "Attacks Made" and "Attacks Suffered" summary lines is calculated as `Object.keys(ownKingdom.provinces).length` — the number of distinct provinces seen across all time, with no date windowing.
- The "Uniques for X:Y" per-province list uses `provinceData.attacksMade` (total all-time attacks), not windowed unique counts.
- `uniquesMade` and `uniquesSuffered` fields exist in the kingdom data structure but are never populated.
- No per-attack date is stored in the data model, making a window-based calculation impossible without a data model change.
- The "Attacks Made Uniques" and "Attacks Suffered Uniques" are currently the same value (same province set), which is wrong — each direction needs its own window calculation.

## Required behaviour (per requirements.md)

> Unique attacks are defined by a 6 day window from the first attack so that all attacks made within 6 in-game days of the first attack count as 1 unique attack and on the 7th in-game day, an attack made would count as a new unique attack. The Unique attack day counter should be set as a variable so that it can be changed easily in the future.

This applies separately to attacks **made** and attacks **suffered**.

For the "Uniques for X:Y" per-province list, unique count per province = the number of distinct 6-day windows in which that province appears as an attacker (for made) or defender (for suffered), sorted descending.

## Changes required

### 1. Data model
- Track a dated attack log per kingdom per direction: store `{ date, provinceName }` entries for attacks made and attacks suffered separately.
- The date should be the parsed in-game date (e.g. day-of-year offset, or comparable integer) so window math is straightforward.

### 2. Unique window constant
- Define `const UNIQUE_WINDOW_DAYS = 6;` at the top of parser.js (already planned in the advanced settings ticket Uto-qa39). This constant is what the advanced settings unique-window control will update.

### 3. Window calculation function
- Implement a `calculateUniques(attackLog, windowDays)` function that:
  1. Sorts the log by date ascending.
  2. Walks through events: when a new event is more than `windowDays` days after the window start, opens a new window.
  3. Counts total windows = total unique attacks.
  4. Also computes per-province unique window counts for the Uniques list.

### 4. Output
- Replace `Object.keys(kingdom.provinces).length` with the result of `calculateUniques` for both "Attacks Made Uniques" and "Attacks Suffered Uniques" in `formatKingdomNewsOutput`.
- Update the "Uniques for X:Y" list to use per-province unique counts from the window calculation rather than raw `attacksMade`.

## Acceptance Criteria

- `Uniques:` in the Attacks Made summary reflects the 6-day window count for outbound attacks.
- `Uniques:` in the Attacks Suffered summary reflects the 6-day window count for inbound attacks.
- The "Uniques for X:Y" per-province list shows per-province unique window counts, sorted descending.
- `UNIQUE_WINDOW_DAYS` is a top-level constant in parser.js.
- Changing `UNIQUE_WINDOW_DAYS` to a different value changes the output correctly.
- Existing parser tests still pass; new tests cover the window logic.
