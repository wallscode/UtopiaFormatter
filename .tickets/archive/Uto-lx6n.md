---
id: Uto-lx6n
status: closed
deps: []
links: []
created: 2026-02-28T12:53:13Z
type: feature
priority: 2
tags: [ui, css, responsive, widescreen]
assignee: Jamie Walls
---
# UI: make layout fluid on wide screens and optionally user-resizable

## Problem

`.container` has a hard `max-width: 1200px`. On widescreen monitors (1440p, 4K, ultrawide) the content is locked to a narrow band in the centre with large dead margins on both sides. The textareas are `width: 100%` relative to their grid column so they can't grow beyond what the container allows.

Textareas currently have `resize: vertical` only — the user cannot drag them wider.

Mobile layout (≤768px) is correct and must not be changed.

## Goals

1. **Fluid container** — on screens wider than ~1400px the container should use a larger percentage of available width (e.g. 90–95vw) rather than stopping at 1200px.
2. **User-controlled width toggle** — add a "Wide mode" button or toggle in the UI so users can switch between the current comfortable reading width (1200px) and a full-width layout on demand. This avoids forcing widescreen users to see an ultra-wide layout when they might prefer the centred look.

## Implementation notes

- For goal 1: add a `@media (min-width: 1400px)` breakpoint that increases `.container` max-width (e.g. `90vw` or `1800px`).
- For goal 2: a small toggle button (e.g. near the header or top-right of the container) that adds/removes a `.wide` class on `.container`. The `.container.wide` rule sets `max-width: 95vw`. State can be persisted to `localStorage` so the preference is remembered.
- Textareas already have `resize: vertical`. Evaluate whether also enabling horizontal resize is desirable, or whether the fluid container alone is sufficient — the grid columns will naturally widen as the container grows.
- Do NOT modify any rules inside `@media (max-width: 768px)` blocks. All changes must be scoped to desktop-only breakpoints so mobile is unaffected.
- Test at 1280px, 1440px, 1920px, and ultrawide (2560px+) widths as well as on mobile (375px, 414px).
