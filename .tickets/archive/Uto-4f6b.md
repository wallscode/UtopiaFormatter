---
id: Uto-4f6b
status: closed
deps: []
links: []
created: 2026-03-03T21:35:28Z
type: bug
priority: 1
assignee: Jamie Walls
tags: [css, ui]
---
# CSS: fix Advanced Settings spanning both columns on wide screens

The Advanced Settings panel still spans both columns on wide screens, covering the right side of the Formatted Output box. Introduced by Uto-wbnp.

Root cause: The media query override (.adv-panel { grid-column: 1; } inside @media (min-width: 768px)) is at line ~100 in main.css, but the base .adv-panel rule { grid-column: 1 / -1; } is at line ~133 — later in the stylesheet. The base rule wins the cascade and nullifies the media query override.

Fix: Remove grid-column: 1 / -1 from the base .adv-panel rule. On a single-column mobile grid, grid-column: 1 / -1 and an unset grid-column behave identically, so removing it has no effect on mobile. The @media (min-width: 768px) block already sets grid-column: 1 and grid-row: 2 for the panel on wide screens.

Expected behaviour:
- Wide screens (≥ 768px): Advanced Settings occupies only the left column (column 1, row 2), never overlapping the Formatted Output on the right.
- Mobile (< 768px): Advanced Settings appears at the bottom of the single-column layout at full width, as before.

