---
id: Uto-grrd
status: closed
deps: []
links: []
created: 2026-02-27T19:08:30Z
type: chore
priority: 2
tags: [css, theme, design]
---
# Retheme: silver/white text on true-black backgrounds, remove yellow-brown tones

The current dark theme uses warm brownish-black backgrounds and yellowish-orange text/accents (#e8dcc8 cream body text, #a89880 muted gold secondary text, #c8a84b gold headings/accents, #12100d–#1e1a14 warm brown backgrounds). Replace these with neutral dark greys/blacks for backgrounds and silver/white tones for text. Accent color should shift from gold to a cool silver-blue so interactive elements still have contrast without looking yellow.

## Current palette → proposed replacements

### Backgrounds
- Body gradient: #12100d–#1e1a14 (warm brown-black) → #0d0d0f–#171719 (neutral dark)
- Header/footer bg: rgba(20,16,12,0.97) → rgba(10,10,12,0.97)
- Section bg: rgba(26,22,16,0.97) → rgba(18,18,20,0.97)
- Textarea bg: #1c1814 → #141416
- Textarea readonly bg: #12100d → #0d0d0f
- Number input bg: #12100d → #0d0d0f
- kbd bg: #12100d → #0d0d0f

### Borders
- #3d3224 (warm brown) → #2a2a2e (neutral grey) — all three usages (textarea, adv-content divider, number input, kbd)

### Text
- #e8dcc8 (warm cream) → #d4d8de (cool light silver) — body text, labels, textarea text
- #a89880 (muted gold-brown) → #7a8290 (muted blue-grey) — secondary/helper text, footer, kbd-shortcuts, adv-group-title

### Accent / headings / interactive
- #c8a84b (gold) → #8aafc8 (steel blue) — h1, h2, adv-toggle-btn text, detect-badge, focus outlines, textarea focus border, kbd text, kbd-shortcuts hover
- rgba(200,168,75,*) tints → rgba(138,175,200,*) at same opacity levels — all gold-tinted backgrounds and borders (detect-badge, order-btn, adv-toggle hover, textarea focus shadow, button hover shadow)
- Primary button gradient: #c8a84b–#7a5c14 → #4a7a9b–#2d5470 (steel blue gradient); button text: #12100d → #ffffff

## What does NOT change
- Clear button (#c53030–#8b2323 red) — keep as-is
- Copy button (#2d6a4f–#40916c green) — keep as-is
- Feedback colors (success green, error red, warning amber) — keep as-is
- All layout, spacing, typography, border-radius — no structural changes
- accent-color on checkboxes — update to match new accent (#8aafc8)

