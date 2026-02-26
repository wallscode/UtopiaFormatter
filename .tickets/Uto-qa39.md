---
id: Uto-qa39
status: closed
deps: [Uto-cyh5]
links: []
created: 2026-02-24T22:35:30Z
type: feature
priority: 2
parent: Uto-cyh5
tags: [ui, advanced-settings, kingdom-news]
---
# Advanced Settings - Kingdom News options

Implement the Kingdom News-specific controls inside the Advanced Parser Settings panel. Options per requirements:

1. Section reordering - allow moving each output section (Own Kingdom Summary, Per-Kingdom Summaries, Uniques, Highlights) up or down in the output
2. Unique attack window - input to change the number of days used in the unique attacks calculation (currently hardcoded at 6)
3. Show/hide attack sub-types - toggles for whether Learn, Massacre, and Plunder appear in the output
4. Uniques grouping - toggle between showing each kingdom's Uniques section immediately after its kingdom block vs. all Uniques sections grouped together at the bottom
5. Show/hide additional actions - toggle for Dragons and Rituals information in the summary

## Acceptance Criteria

- Each setting re-parses or re-renders the output immediately on change
- Unique window change re-calculates unique counts with new value
- Hiding an attack type removes it from both summary and per-province rows
- Uniques grouping toggle moves the Uniques blocks in the output
- Dragons/Rituals toggle removes those lines from the Own Kingdom Summary

