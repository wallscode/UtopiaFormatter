---
id: Uto-akkk
status: closed
deps: []
links: []
created: 2026-02-28T12:45:44Z
type: feature
priority: 2
tags: [parser, province-news, daily-login-bonus]
assignee: Jamie Walls
---
# Province News: parse daily login bonus events and show type breakdown

## Background

Lines beginning with "Your people appreciate" are daily login bonus events. They are currently unhandled — they fall through to `logUnrecognizedLine` — so no data from them is captured.

The existing Daily Login Bonus output section is built from two separate event patterns (monthly land grants and monthly income), not from these lines.

## Bonus types

| Keyword in line | Bonus tier | Activity threshold |
|---|---|---|
| `extreme` | Maximum | 12 hours |
| `impressive` | Mid | 6 hours |
| *(unknown)* | Minimum | 1 hour |

The 1-hour bonus line text is not yet known. For now, any "Your people appreciate" line that contains neither "extreme" nor "impressive" should be treated as the 1-hour tier and logged via `logUnrecognizedLine` so the raw text can be captured for future identification.

## Resources granted

These lines include the resources awarded. Extract and total them — expected to include some combination of acres, gold coins, and science books (exact phrasing TBD from real log data).

## Implementation

- Add a `loginBonus` field to the `data` object in `parseProvinceNews`:
  ```javascript
  loginBonus: { extreme: 0, impressive: 0, unknown: 0, acres: 0, gold: 0, books: 0 }
  ```
- In `parseProvinceNewsLine`, add a handler for lines containing `"Your people appreciate"`:
  - Increment the appropriate tier counter based on presence of `"extreme"` or `"impressive"`
  - Extract and accumulate resource amounts (acres, gold coins, science books)
  - For unrecognised tier (neither keyword), increment `unknown` and also call `logUnrecognizedLine` so the raw text is captured
- In `formatProvinceNewsOutput`, update the Daily Login Bonus section to also display:
  - Total bonus count with tier breakdown, e.g.:
    ```
    Daily Login Bonus: 8 total (3 extreme, 4 impressive, 1 unknown)
    ```
  - Resource totals from these events alongside the existing monthly land/income totals
