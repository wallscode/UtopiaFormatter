---
id: Uto-i5bd
status: open
deps: []
links: []
created: 2026-02-25T03:27:06Z
type: bug
priority: 2
tags: [parser, kingdom-news, output]
---
# Kingdom News output: Bounces row missing failure rate percentage

The requirements specify:

> "Count of failed or bounced attacks as well as a percent failure rate which would be failed attacks over the total attacks made by the kingdom from which the news was copied."

The current output shows only `Bounces: N` with no percentage. It should show something like `Bounces: 3 (12%)` where the percentage is `bouncesMade / attacksMade * 100` (for the Made section) and `bouncesSuffered / attacksSuffered * 100` (for the Suffered section).

## Required behaviour

- Attacks Made summary: `Bounces: N (X%)` where X = round(bouncesMade / attacksMade * 100)
- Attacks Suffered summary: `Bounces: N (X%)` where X = round(bouncesSuffered / attacksSuffered * 100)
- If `attacksMade` or `attacksSuffered` is 0, show 0% to avoid division by zero

## Acceptance Criteria

- Both Bounces rows include the percentage in parentheses
- Percentage is correctly calculated per direction (Made vs Suffered)
- Division by zero is handled gracefully
