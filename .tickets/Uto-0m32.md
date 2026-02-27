---
id: Uto-0m32
status: closed
deps: []
links: []
created: 2026-02-25T03:23:41Z
type: task
priority: 2
tags: [accessibility, wcag, ada, ui, css]
---
# WCAG 2.1 AA / ADA compliance audit and remediation

The requirements specify the site must be ADA compliant and WCAG conformant (AA) as much as possible without impeding core functionality. A codebase audit has identified a number of failures and gaps across colour contrast, focus visibility, animation, ARIA, and touch targets.

## Issues to fix

### 1. Colour contrast — WCAG 1.4.3 (AA)

Verify and fix the following combinations using a contrast checker (required ratio: 4.5:1 for body text, 3:1 for large text and UI components):

- **Secondary / label text** `#a89880` on dark section backgrounds (~3.2:1) — increase luminance to meet 4.5:1
- **Amber accent text** `#c8a84b` used on buttons and the adv-toggle — verify against each background it appears on; increase if below 3:1 for large/UI text
- **Order button arrows** `#c8a84b` on `rgba(200,168,75,0.12)` background (~2.8:1) — increase button background opacity or change foreground colour
- **Input `[type="number"]` text** `#e8dcc8` on `#12100d` — verify; increase if below 4.5:1
- Run equivalent checks in light mode

### 2. Focus indicators — WCAG 2.4.7 (AA), 2.4.11 (AA 2.2)

- Add explicit `:focus-visible` styles for all buttons (parse, clear, copy, theme toggle, adv toggle, order buttons). A visible outline or high-contrast ring is required — relying on hover styles alone is insufficient.
- Ensure focus style is not suppressed for keyboard users (only use `outline: none` paired with a custom `:focus-visible` replacement, never without one).
- The `:focus` on textareas uses `box-shadow` only — confirm it is perceptible to colour-blind users (add an outline or border change in addition).

### 3. Reduced motion — WCAG 2.3.3 (AA)

Add a `@media (prefers-reduced-motion: reduce)` block in `css/main.css` that:
- Disables all `transition` properties on body, sections, buttons, textareas
- Stops the arrow-icon rotate animation on the adv-toggle (`.adv-toggle-icon`)
- Stops the scroll `behavior: smooth` in `ui.js` (use `block: 'nearest'` or guard with `window.matchMedia('(prefers-reduced-motion: reduce)')`)

### 4. ARIA on dynamically-generated elements — WCAG 4.1.2 (AA)

In `js/ui.js`, the province log order buttons are generated without `aria-label`:
- `upBtn` and `downBtn` use `title` (tooltip-only) — add `aria-label` e.g. `"Move Thievery Summary up"` so the action and subject are announced by screen readers.
- The generated checkboxes in `renderProvinceLogsSettings` and `renderKingdomNewsSettings` already use `<label for>` correctly — no change needed there.

### 5. Emoji in theme toggle — WCAG 1.1.1 (A)

`🌙` and `☀️` are set via JS as `textContent` of `.theme-icon`. Screen readers announce emoji descriptions which may be verbose or inconsistent across readers. The parent button already has `aria-label="Toggle theme"`, so:
- Add `aria-hidden="true"` to `.theme-icon` in `index.html`; the JS in `theme.js` must preserve that attribute when setting `textContent` (switch to setting it on a child `span` that already carries `aria-hidden`).

### 6. Touch target size — WCAG 2.5.5 (AAA) / 2.5.8 (AA 2.2)

- Order buttons are 24×24 px — meets 2.5.8 minimum (24×24 CSS px) but add at least 10px padding or margin so the interactive area reaches the 44×44 recommended touch target on mobile.

### 7. Keyboard shortcut discoverability — WCAG 2.1.4 (A)

Keyboard shortcuts (Ctrl+Enter, Escape, Ctrl+Shift+C) are only logged to the console. Add a small visible help hint in the UI (e.g. below the button group or as a `<details>` element) so keyboard-only users can discover them. The hint should not be intrusive on mobile.

## Acceptance Criteria

- No WCAG 2.1 AA contrast failures in either dark or light mode (verified with a tool such as WebAIM Contrast Checker or browser DevTools)
- All interactive elements show a clearly visible focus ring when navigated by keyboard
- All transitions and animations are suppressed when `prefers-reduced-motion` is set
- Dynamically generated order buttons announce their action and target section via `aria-label`
- Theme toggle emoji is `aria-hidden` and does not pollute the button's accessible name
- Order buttons have an effective touch target of at least 44×44 px on mobile
- Keyboard shortcut hints are visible in the UI
