---
id: Uto-qsxw
status: closed
deps: []
links: []
created: 2026-02-28T18:09:09Z
type: feature
priority: 2
tags: [ui, css, layout, output]
assignee: Jamie Walls
---
# UI: default to wide layout on desktop, remove wide mode toggle, auto-expand output textarea

## Part 1 — Remove wide mode toggle; wide layout is always-on for desktop

The wide mode toggle button added in Uto-lx6n should be removed. Wide layout becomes the default on all non-mobile screens.

### Changes

**`index.html`**
- Remove the `<button id="wide-mode-btn" ...>` from the header.

**`css/main.css`**
- Remove the `@media (min-width: 1400px)` breakpoint that set `max-width: min(1600px, 90vw)`.
- Remove the `.container.wide` rule.
- Remove the `#wide-mode-btn` and `.header-content` positioning styles (added for the button).
- Change `.container` base rule to `max-width: 95vw` so wide layout is the permanent default on desktop.
- The existing `@media (max-width: 768px)` mobile rules must remain unchanged.

**`js/ui.js`**
- Remove `wideModeBtn` and `mainContainer` from `getDomElements()`.
- Remove the wide mode toggle block from `setupEventListeners()` (the `localStorage.getItem / classList.toggle / localStorage.setItem` logic).
- No localStorage key needs to be migrated — just remove it.

---

## Part 2 — Auto-expand output textarea to fit content (up to 80vh)

After the output textarea is populated with parsed results, automatically resize it vertically to fit its content, capped at 80% of the viewport height. Small outputs show without scrolling; large outputs scroll within the capped height.

### Behaviour

- Trigger on every parse (initial and re-parse from Advanced Settings changes).
- Set `height: auto` first to reset, then set `height = min(scrollHeight, 0.8 * window.innerHeight)`.
- `resize: vertical` should remain in CSS so users can still manually drag the textarea taller or shorter after the auto-size.
- Do not auto-resize the input textarea — only the output.
- On mobile (`≤768px`) the behaviour should be the same (80vh cap still applies; the textarea was already `min-height: 120px` which remains as the floor).

### Implementation

Add a helper to `js/ui.js`:

```javascript
function autoResizeOutput(el) {
    el.style.height = 'auto';
    const maxHeight = Math.floor(window.innerHeight * 0.8);
    el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px';
}
```

Call `autoResizeOutput(elements.outputText)` in:
1. `handleParse()` — after `elements.outputText.value = parsedText`
2. `applyAndRerender()` — after the output textarea is updated with the re-applied settings result

### CSS note

Remove any fixed `rows="10"` influence — the textarea height will be driven by JS after parse. The `rows` attribute on the `<textarea>` in `index.html` can remain as the pre-parse placeholder size (it only applies before JS sets an explicit height).

---

## Implementation touch points

- `index.html` — remove `#wide-mode-btn`
- `css/main.css` — simplify `.container` to always-wide; remove button/toggle styles
- `js/ui.js` — remove wide mode state/listeners from `getDomElements` and `setupEventListeners`; add `autoResizeOutput` helper; call it from `handleParse` and `applyAndRerender`
