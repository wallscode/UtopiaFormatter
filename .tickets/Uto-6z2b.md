---
id: Uto-6z2b
status: closed
deps: []
links: []
created: 2026-03-01T15:11:41Z
type: task
priority: 2
assignee: Jamie Walls
---
# Mobile: hide logo in portrait orientation

## Problem

On mobile in portrait mode the 90×90px `.site-logo` sits inline-flex beside
the title and subtitle text inside `.header-content`. On a narrow screen this
forces the header to consume most of the visible viewport, requiring the user
to scroll before they reach any usable content.

In landscape mode the wider viewport comfortably accommodates the logo
alongside the text, so the logo should remain visible there.

## Current state — `css/main.css`

```css
.header-content {
    display: inline-flex;
    align-items: center;
    gap: 1rem;
}

.site-logo {
    width: 90px;
    height: 90px;
    object-fit: contain;
    flex-shrink: 0;
}

/* existing mobile breakpoint — no logo rule */
@media (max-width: 768px) {
    header h1 { font-size: 1.8rem; }
}
```

## Fix — `css/main.css` only, one new media query

Add the following block in the Mobile section of the stylesheet (near the
other `@media (max-width: 768px)` rules):

```css
@media (max-width: 768px) and (orientation: portrait) {
    .site-logo {
        display: none;
    }
}
```

`orientation: portrait` is true whenever the viewport height exceeds its
width — i.e. a phone held upright. Rotating to landscape flips the condition
to false and the logo reappears with no JavaScript required.

## Notes

- No changes to `index.html` or any JS files.
- No test changes needed.
- The `768px` breakpoint matches every other mobile breakpoint already used
  in the stylesheet, so behaviour is consistent.
- If the header still feels tall on portrait mobile after the logo is hidden,
  reducing `header { padding }` at this breakpoint is a follow-up concern
  outside this ticket's scope.
