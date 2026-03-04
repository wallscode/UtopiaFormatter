---
id: Uto-6x1w
status: closed
deps: []
links: []
created: 2026-03-03T22:04:09Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [ui, kingdom-news]
---
# Kingdom News Advanced Settings: combine Section Order and Show/Hide into a single Sections group

Province Logs Advanced Settings has a single 'Sections' group where each output section gets one row containing ▲/▼ reorder buttons, a show/hide checkbox, and the section name — all combined.

Kingdom News currently has two separate groups:
  - 'Show / Hide' (left column) — content-type toggles: Attacks, Dragons, Kingdom Relations, Rituals (these control lines *within* sections, not sections themselves)
  - 'Section Order' (right column) — ▲/▼ buttons only, no show/hide checkbox per section

The five Kingdom News output sections are:
  'Own Kingdom Summary', 'Per-Kingdom Summaries', 'Uniques', 'Highlights', 'Kingdom Relations'

Changes required:

1. advSettings.kingdomNews — add a visible dict with a default true for each section:
   visible: {
     'Own Kingdom Summary': true,
     'Per-Kingdom Summaries': true,
     'Uniques': true,
     'Highlights': true,
     'Kingdom Relations': true,
   }

2. applyKingdomNewsSettings — in Step 5, skip any section where s.visible[section] is false (same pattern as applyProvinceLogsSettings / applyProvinceNewsSettings).

3. renderKingdomNewsSettings — replace the 'Section Order' group in rightCol with a 'Sections' group (can stay in rightCol) that renders each section in sectionOrder as one list item: ▲ btn + ▼ btn + checkbox (tied to visible[name]) + section name. Use the same section-order-list / section-order-item CSS already in place.

4. The existing 'Show / Hide' group (content-level toggles for attack types, dragons, relations, rituals) is separate from section visibility and stays in leftCol unchanged — it is NOT merged into the new Sections list.

5. Update the applyKingdomNewsSettings tests in tests/kingdom-news-log.test.js to cover section visibility toggling (visible[name] = false hides the section), using the same pattern as the Province Logs and Province News settings tests.

