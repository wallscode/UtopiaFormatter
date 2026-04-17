---
id: Uto-njxz
status: closed
deps: []
links: []
created: 2026-03-10T01:13:38Z
type: task
priority: 2
assignee: Jamie Walls
---
# Card width sizing options for enhanced output view

## Design

Four options for making ev-grid cards shrink to content width instead of stretching to fill column width. Each option is self-contained and can be implemented or rolled back independently.

## Background

ev-grid currently uses grid-template-columns: 1fr 1fr on desktop and 1fr on mobile. Cards stretch to fill their column regardless of content, leaving 40-50% of card width as dead space. Text inside cards (ev-stat-row lines) typically fills only 50-60% of card width.

---

## Option A: Flexbox with natural content sizing

### Implement

In css/main.css, replace the ev-grid block and its desktop media query:

BEFORE:
.ev-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
}

@media (min-width: 768px) {
    .ev-grid {
        grid-template-columns: 1fr 1fr;
    }
}

AFTER:
.ev-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: start;
}

.ev-card,
.ev-kn-block {
    flex: 0 0 auto;
    min-width: 220px;
}

.ev-full-width {
    flex: 0 0 100%;
    width: 100%;
}

Also remove the grid-column: 1 / -1 from .ev-report-header and .ev-full-width since those properties only apply to grid layout - they have no effect in flexbox. Instead rely on flex: 0 0 100%; width: 100% on .ev-full-width, and add the same to .ev-report-header.

No JS changes needed.

### Roll back

Reverse the CSS changes above: restore ev-grid to display: grid / grid-template-columns, restore ev-card and ev-kn-block to their original state (no flex properties), restore ev-full-width and ev-report-header to grid-column: 1 / -1.

### Trade-offs

Pro: Each card is exactly as wide as its widest line. No wasted horizontal space. Cards pack efficiently.
Con: Loses strict 2-column pairing. A narrow card and wide card on the same row look uneven. Needs min-width to prevent tiny cards.

---

## Option B: max-content grid columns

### Implement

In css/main.css, change only the desktop media query for ev-grid:

BEFORE:
@media (min-width: 768px) {
    .ev-grid {
        grid-template-columns: 1fr 1fr;
    }
}

AFTER:
@media (min-width: 768px) {
    .ev-grid {
        grid-template-columns: max-content max-content;
        justify-content: start;
    }
}

No other changes needed. ev-full-width and ev-report-header already have grid-column: 1 / -1 which still works.

### Roll back

Restore the desktop ev-grid media query to grid-template-columns: 1fr 1fr and remove justify-content: start.

### Trade-offs

Pro: Still a proper 2-column grid. Each column shrinks to its widest card.
Con: Two columns may be very unequal in width. Dead space appears on the right of the grid rather than inside cards.

---

## Option C: fit-content columns with a cap

### Implement

In css/main.css, change only the desktop media query for ev-grid:

BEFORE:
@media (min-width: 768px) {
    .ev-grid {
        grid-template-columns: 1fr 1fr;
    }
}

AFTER:
@media (min-width: 768px) {
    .ev-grid {
        grid-template-columns: fit-content(500px) fit-content(500px);
        justify-content: start;
    }
}

Adjust the 500px cap as needed based on visual results. 400px-600px is a reasonable starting range.

### Roll back

Restore the desktop ev-grid media query to grid-template-columns: 1fr 1fr and remove justify-content: start.

### Trade-offs

Pro: Content-sized columns with a safety ceiling. Best of Options A and B.
Con: Cap value needs tuning. If content regularly hits the cap, columns revert to the same fixed-width problem.

---

## Option D: justify-self on cards (minimal change)

### Implement

In css/main.css, add to the .ev-card and .ev-kn-block rules:

.ev-card {
    /* existing properties... */
    width: fit-content;
    justify-self: start;
}

.ev-kn-block {
    /* existing properties... */
    width: fit-content;
    justify-self: start;
}

No grid changes needed.

### Roll back

Remove width: fit-content and justify-self: start from .ev-card and .ev-kn-block.

### Trade-offs

Pro: Simplest possible change. Grid structure is completely preserved.
Con: Empty space moves from inside the card to between the card and next column. Visually similar to the original problem.

## Acceptance Criteria

Cards display without excessive unused horizontal space. Text in cards fills close to the full card width. The chosen option is self-contained and can be rolled back by following the rollback instructions in the design section.

