---
id: Uto-b2kf
status: closed
deps: []
links: []
created: 2026-03-09T19:47:04Z
type: task
priority: 2
assignee: Jamie Walls
---
# Auto-collapse input section on mobile after parsing

On mobile (pointer: coarse or viewport < 768px), after a successful parse, automatically collapse the input section so the output gets maximum screen space. The user should be able to expand it again if needed. Depends on Uto-c2r6.

## Design

## Collapse behavior
- After a successful parse on mobile, wrap the input section in a collapsed state (similar to the Advanced Settings collapse pattern)
- Show a tap-to-expand bar: 'Input Text ▶' that expands back to the full input textarea
- The secondary input section (Province News for combined mode) collapses with it
- On Clear, the input section re-expands automatically

## Implementation
- Use the same aria-expanded / hidden pattern as Advanced Settings
- Only apply on mobile — desktop keeps the input always visible in the left column
- Collapse happens after the parse success message and scroll-to-output

## Edge cases
- If parse fails, do NOT collapse the input
- If user toggles Advanced Settings 'Combined Summary' toggle while input is collapsed, re-expand it so they can paste into the secondary textarea

## Acceptance Criteria

- On mobile, successful parse collapses the input section
- Collapsed state shows a labeled bar that can be tapped to re-expand
- Clear button re-expands the input section
- Desktop input remains always visible
- Parse errors do not trigger collapse
- Accessible: aria-expanded, keyboard operable

