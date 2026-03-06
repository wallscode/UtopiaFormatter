---
id: Uto-wbnp
status: closed
deps: []
links: []
created: 2026-03-03T20:36:14Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [ui, css]
---
# Layout: move Advanced Settings below Input Text in left column on wide screens

On wide screens (≥ 768px) the Advanced Settings panel sits full-width below both columns, leaving a large empty space under the Input Text box when the Formatted Output box is tall. Move it into the left column so it sits directly below the Input Text box, letting the Formatted Output box use the full height of both rows on the right.

Current structure (wide):
  Col 1          | Col 2
  Input Text     | Formatted Output
  Advanced Settings (spans both columns, full-width)

Target structure (wide):
  Col 1          | Col 2
  Input Text     | Formatted Output
  Adv Settings   | (Formatted Output cont.)

Implementation — CSS grid changes in main.css (≥ 768px breakpoint):
  - Remove grid-column: 1 / -1 from .adv-panel (or override it to column 1)
  - Add grid-row: 1 to .input-section and grid-row: 1 to .output-section
  - Add grid-row: 2 to .adv-panel
  - Add grid-row: 1 / 3 (span 2) to .output-section so it fills the full right column height
  - .adv-panel keeps grid-column: 1 (left column only)

Mobile (< 768px): no changes — single column, Advanced Settings naturally appears after the output section as it does today.

The Advanced Settings panel must remain collapsed by default (no JS change needed — aria-expanded=false is already set and functions correctly).

