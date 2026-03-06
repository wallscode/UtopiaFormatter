---
id: Uto-yad0
status: closed
deps: []
links: []
created: 2026-02-24T22:57:50Z
type: feature
priority: 1
tags: [ui, accessibility, design]
---
# Align UI with requirements

Audit and update the UI to match the requirements in 'Utopia Game Parser Requirements.md'. Three specific gaps identified:

1. Default theme must be dark
   - theme.js line 37 falls back to THEMES.LIGHT when no preference is saved
   - Requirements say 'modern UI and modern dark theme' — dark should be the default, not an opt-in
   - Change the fallback from THEMES.LIGHT to THEMES.DARK (system preference detection already exists and can still override for users who have set a light preference)

2. Utopia-inspired visual design
   - Requirements ask for 'hints of inspiration from the Utopia game website but no exact content'
   - Current design is a generic purple gradient with no game-world character
   - Review utopia-game.com for aesthetic reference (colour palette, typography mood, iconography style) and apply non-copyrightable design cues — e.g. earthy/medieval colour tones, fantasy-adjacent styling
   - The theme toggle, header, section cards, and buttons are the main surfaces to update

3. WCAG / ADA accessibility audit and fixes
   - Textareas currently have no <label> elements — placeholder text does not satisfy WCAG 1.3.1 (Info and Relationships) or 2.4.6 (Headings and Labels); labels must be added (can be visually hidden if layout requires)
   - Audit colour contrast ratios in both light and dark modes against WCAG AA minimums (4.5:1 normal text, 3:1 large text)
   - Verify all interactive elements have accessible names (buttons, toggle)
   - Verify keyboard focus order is logical and focus indicators are visible

## Acceptance Criteria

- Fresh page load (no localStorage) defaults to dark mode
  - Visual design has a clearly game-world / medieval-fantasy character without reusing any Utopia site assets
  - All form inputs have associated <label> elements (or aria-label where layout makes visible labels impractical)
  - Colour contrast passes WCAG AA in both dark and light modes
  - Tab order through the page is logical and focus rings are visible

