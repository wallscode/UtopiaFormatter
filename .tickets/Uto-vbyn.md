---
id: Uto-vbyn
status: closed
deps: []
links: []
created: 2026-03-08T16:52:21Z
type: task
priority: 2
assignee: Jamie Walls
---
# Enhanced output view with rich formatting and colors

Add a toggle in Advanced Settings to switch the output area from the plain text box to a styled HTML panel. The enhanced view renders the same parsed data visually — using color, typography, cards, and layout — instead of plain monospace text. It is not constrained to a textarea and adapts to desktop and mobile viewports.

The enhanced view is read-only and informational. The plain text output remains available (for copying to forum/Discord) and is what the copy buttons always act on regardless of which view is active.

This feature spans all four parser modes: Kingdom News Log, Province News, Province Logs, and Combined Province Summary.

## Design

## Toggle placement
A single 'Enhanced View' toggle in the global Display Options section (or at the top of Advanced Settings, visible in all modes). Persisted to localStorage like other settings.

## Layout — Kingdom News Log
- Full-width header bar: 'Kingdom News Report' title + date range
- **Own Kingdom card**: accent-bordered card (kingdom color), grid of stat chips (Attacks Suffered, Acres Lost, Rituals Started, etc.), Highlights sub-section with bold callouts
- **Per-Kingdom cards**: one card per enemy kingdom, color-coded header (war opponent gets a distinct accent), attack type rows as a mini table (icon or label | count | acreage), bounces row, unique count badge
- **Uniques section**: sorted list of provinces with unique count badges
- **Kingdom Relations**: timeline-style list of war/ceasefire events with timestamps

## Layout — Province Logs / Province News / Combined
- Section cards with a colored left-border accent matching the section type (offense = amber, defense = teal, resources = green, misc = grey)
- Within each card: a two-column key/value grid for numeric stats; sub-lists for per-target breakdowns (Thievery Targets, Spell Targets)
- Combined view merges Aid Sent/Received/Net into a single card with directional arrows and net color (green = net gain, red = net loss)

## Colors (dark theme, matching existing site palette)
- Background: existing site dark (#0f0f13 / #1a1a1f)
- Card surface: #1e1e26
- Card border accents: offense #c8a450, defense #4a9aba, resources #4aaa6a, misc #555566
- War opponent kingdom: border accent #c85050
- Own kingdom: border accent #6a8aba
- Positive numbers: #6abf7a, negative: #c86a6a, neutral: #d4d8de
- Section titles: #8aafc8 (existing link/accent color)
- Timestamps / secondary text: #7a8290

## Responsive
- Desktop: cards in a 1-column flow within the existing right-panel width; per-kingdom cards can use a 2-column mini-grid for attack stats
- Mobile: single column, cards full-width, stat chips wrap, font sizes match existing mobile scale

## Implementation notes
- Add a `renderEnhancedView(container, parsedText, mode)` function in ui.js that parses the structured plain-text output back into DOM, or (preferred) have the parser expose a structured data object alongside the text so the enhanced view can render directly from data
- The toggle hides the `<textarea id='outputText'>` and shows a `<div id='enhancedOutput'>` in its place (same container)
- Copy buttons always read from the hidden textarea, not the enhanced view
- Enhanced view rerenders whenever the output changes (same trigger path as textarea update)

## Acceptance Criteria

- Advanced Settings has an 'Enhanced View' toggle visible in all modes
- Toggling on replaces the output textarea with a styled HTML panel showing the same data
- Toggling off restores the plain text textarea
- Copy buttons work correctly regardless of which view is active
- Kingdom News enhanced view shows own-kingdom card, per-kingdom cards, uniques, highlights, and relations sections
- Province Logs / Province News / Combined enhanced view shows section cards with color-coded left borders and key/value stat grids
- Color scheme matches the dark site palette
- Layout is appropriate on both desktop and mobile (single-column, responsive)
- Enhanced view rerenders automatically when new data is parsed
- Toggle state persists across page reloads via localStorage

