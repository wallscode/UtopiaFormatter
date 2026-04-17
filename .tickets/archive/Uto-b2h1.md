---
id: Uto-b2h1
status: closed
deps: []
links: []
created: 2026-03-09T22:11:35Z
type: task
priority: 2
assignee: Jamie Walls
---
# Fix mobile card margins and text wrapping in Clean Cards view

In Clean Cards view on mobile, increase left and right margins to minimize word wrapping. Fix issue where longer keys in Own Kingdom Summary cause values to move outside the card. Example: 'Enemy Dragons Started: 2' followed by '(Topaz,' and 'Topaz)' on separate lines. Values should wrap below the key text cleanly, showing 'Enemy Dragons Started: 2' on first line and '(Topaz, Topaz)' on second line below the key.

## Design

Update CSS media queries for mobile in ui.js to increase card padding/margins. Implement flexbox or grid layout for key-value pairs that allows values to wrap below keys when space is constrained. Target mobile breakpoints (e.g., max-width: 768px) to apply these styles.

## Acceptance Criteria

On mobile: cards have increased margins, longer keys allow values to wrap cleanly below them without breaking outside card boundaries. Example dragon output shows value on line below key text.

