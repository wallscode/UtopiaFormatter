---
id: Uto-bdna
status: closed
deps: []
links: []
created: 2026-03-09T19:47:51Z
type: task
priority: 2
assignee: Jamie Walls
---
# Three card design variants with temporary toggle

Build three visually distinct card design variants for the enhanced output view, switchable via a temporary radio group in Advanced Settings. This lets the user compare all three live on the site before committing to one. The two unchosen variants should be easy to remove. Depends on Uto-c2r6.

## Design

## Variant A: Clean Cards (refine current)
- Cards with left-border accent color by section type
- Key: Value as inline text, no right-justification
- Subsection headers in uppercase muted text
- Lists with subtle dot markers
- Refined mobile sizing: slightly larger fonts, more padding
- Similar to current enhanced view but polished

## Variant B: Compact Table
- Each section rendered as a table with a colored header bar (section name in white on the accent color)
- Alternating row backgrounds (#1a1a1f and #16161a) for readability
- Columns: Label | Value, right-aligned values within the table context
- Sub-sections as grouped row spans with a subtle left indent
- Compact and data-dense — good for power users
- On mobile: table stays single-column, header bar full-width

## Variant C: Dashboard
- Top-level summary stats as large metric chips: big number (1.2rem bold), small label below (0.7rem muted)
- Chips in a flex-wrap row at the top of each section card
- Detail items (sub-lists, per-target breakdowns) in a collapsible details/summary below the chips
- Section card has a subtle top-border accent (not left-border)
- More visual hierarchy — key numbers pop, details are available but not overwhelming
- On mobile: chips wrap to 2-per-row, details sections start collapsed

## Toggle
- Radio group in Advanced Settings under a 'Card Style' heading: Clean Cards / Compact Table / Dashboard
- Stored as advSettings string (e.g. `cardStyle: 'clean'`)
- Switching re-renders the enhanced output immediately
- Default: 'clean' (Variant A)

## Cleanup
- Each variant's render function is self-contained (e.g. renderCleanCards, renderCompactTable, renderDashboard)
- CSS for each variant uses a distinct prefix (ev-a-, ev-b-, ev-c-)
- Removing a variant = delete its render function + CSS block + radio option

## Acceptance Criteria

- Three card styles are selectable in Advanced Settings
- Switching styles re-renders the output immediately
- All three variants render all section types correctly (KN, PL, PN, Combined)
- Each variant looks good on both desktop and mobile
- Code is structured so removing a variant is a clean deletion
- Default is Variant A (Clean Cards)

