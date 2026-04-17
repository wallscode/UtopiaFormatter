---
id: Uto-2d90
status: closed
deps: []
links: []
created: 2026-03-09T22:11:48Z
type: task
priority: 2
assignee: Jamie Walls
---
# Optimize desktop layout to reduce scrolling and improve space usage

Desktop two-column layout requires excessive scrolling and doesn't utilize available screen space. Implement collapsible input field at top that collapses when Parse is clicked. Output should use optimized two-column layout: Total Attacks Made (left) and Total Attacks Suffered (right) in first row, Own Kingdom report (left) with most-attacked kingdom (right) in next row, subsequent kingdoms follow. Highlights card spans both columns. Province Logs uses two-column view with no full-width cards. Card widths should expand only as needed for content, not force right column to start at screen center if left column only needs 1/3 width.

## Design

Update ui.js Clean Cards rendering to implement collapsible input section with expand/collapse toggle. Create CSS grid or flexbox layout for two-column output with intelligent width distribution based on content. Implement card placement logic for Kingdom News and Province Logs that arranges cards in specified order. Ensure Highlights card spans both columns while other cards remain single-column. Add CSS to allow dynamic column widths based on content rather than fixed 50/50 split.

## Acceptance Criteria

Desktop view: input collapses after Parse (can be re-expanded). Output shows two-column layout with specified card arrangement. Card widths adjust to content. Highlights spans both columns. No changes to raw text output.

