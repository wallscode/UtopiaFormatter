---
id: Uto-1a2b
status: open
deps: []
links: []
created: 2026-02-26T19:57:00Z
type: bug
priority: 2
tags: [parser, province-news, ui, summary]
---
# Fix province news summary bugs

The province news parser has several issues with how it summarizes and categorizes different types of events. The output format needs to be reorganized for better clarity and accuracy.

## Current Issues

- Monthly land and Monthly income sections are separate and show unnecessary month-by-month details
- Scientists section shows too much detail without proper categorization
- Aid Received section lacks proper summarization by type
- Thievery section has incorrect naming and missing event types
- Hazards & Events section should be renamed to better reflect its content

## Required Changes

### 1. Daily Login Bonus Section
- Combine "Monthly land" and "Monthly income" sections
- Rename to "Daily Login Bonus"
- Only show total acres, gold, and science gained
- Remove month-by-month breakdown details

### 2. Scientists Section
- Only show total counts of scientists
- Categorize by type: Economy, Military, and Arcane Arts
- Exclude any zero values from display

### 3. Aid Received Section
- Summarize by type received: gold coins, food (bushels), runes, soldiers, or acres
- **Advanced option**: Track how much was received from each province including type (optional feature)
- **Default**: Only show summary totals by type

### 4. Thievery Impacts Section (renamed from "Thievery")
- Include "Rioting" events as "Incite Riots"
- Include "Mana Disruptions" events as "Sabotage Wizards"
- Include "Troop desertions" events as "Propaganda"
- Include failed propaganda attempts
- Include "Turncoat General" events as "Bribe General"

### 5. Magic Impacts Section (renamed from "Hazards & Events")
- Rename section to better reflect magical nature of events
- Maintain existing meteor and other magical event categorization

## Acceptance Criteria

- All sections renamed as specified
- Zero values excluded from all summaries
- Aid Received properly categorized by type
- Thievery events correctly mapped to new naming scheme
- Daily Login Bonus shows only totals (no monthly breakdown)
- Scientists properly categorized by type with totals only
- Existing province news parsing functionality remains intact
- All tests pass with new format
- Advanced aid tracking option noted for future implementation
