---
id: Uto-x8cq
status: closed
deps: []
links: []
created: 2026-03-09T22:11:57Z
type: task
priority: 2
assignee: Jamie Walls
---
# Add color-coded left borders to Kingdom News cards by kingdom

Add colored left borders to Kingdom News cards in Clean Cards view, similar to the existing functionality in Province News and Province Logs. Group colors by kingdom association: Own Kingdom cards should be green, each enemy kingdom should have a distinct color, and Uniques cards should match their associated kingdom's color.

## Design

Update ui.js Clean Cards rendering for Kingdom News to add colored left borders to cards. Implement color assignment logic that assigns green to own kingdom cards, generates distinct colors for each enemy kingdom, and matches Uniques cards to their kingdom's color. Use CSS border-left property similar to Province News/Province Logs implementation.

## Acceptance Criteria

Kingdom News cards in Clean Cards view have colored left borders. Own Kingdom cards are green. Each enemy kingdom has a unique color. Uniques cards match their kingdom's color.

