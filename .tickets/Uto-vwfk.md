---
id: Uto-vwfk
status: closed
deps: []
links: []
created: 2026-03-02T22:21:34Z
type: feature
priority: 2
assignee: Jamie Walls
---
# Advanced Settings: two-column layout — Sections left, Display Options right on wide screens

## Goal

On screens wide enough to show both columns comfortably, Advanced Settings renders Sections and Display Options side-by-side. On narrow screens (mobile portrait) they remain stacked vertically as today.

---

## Layout target

```
┌─────────────────────────────────────────────────────┐
│  Advanced Settings                                  │
│  ┌────────────────────┐  ┌────────────────────────┐ │
│  │ Sections           │  │ Display Options        │ │
│  │ [section list]     │  │ ☑ Show Averages        │ │
│  │                    │  │ ☐ Show Failed Thievery │ │
│  │                    │  │ ...                    │ │
│  └────────────────────┘  └────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

On narrow screens (< 900 px): columns stack vertically (Sections above Display Options), same as current behaviour.

---

## Applies to all three modes

| Mode | Left column | Right column |
|---|---|---|
| **Province Logs** | Sections (reorder list) | Display Options (all checkboxes) |
| **Kingdom News** | Show / Hide + Unique Window | Display Options + Section Order |
| **Province News** | Sections (reorder list) | Display Options (checkboxes) |

---

## Implementation — `js/ui.js`

### 1. Helper in `renderAdvancedSettings`

After clearing `container.innerHTML`, create two column wrappers and pass them to each render function:

```javascript
function renderAdvancedSettings(elements) {
    const container = elements.advContent;
    container.innerHTML = '';

    const leftCol  = document.createElement('div');
    leftCol.className  = 'adv-col adv-col-left';
    const rightCol = document.createElement('div');
    rightCol.className = 'adv-col adv-col-right';
    container.appendChild(leftCol);
    container.appendChild(rightCol);

    if (lastDetectedMode === 'kingdom-news-log') {
        renderKingdomNewsSettings(leftCol, rightCol, elements);
    } else if (lastDetectedMode === 'province-news') {
        renderProvinceNewsSettings(leftCol, rightCol, elements);
    } else {
        renderProvinceLogsSettings(leftCol, rightCol, elements);
    }
}
```

### 2. Update each render function signature

Change `(container, elements)` → `(leftCol, rightCol, elements)` in:
- `renderKingdomNewsSettings`
- `renderProvinceLogsSettings`
- `renderProvinceNewsSettings`

Append content to `leftCol` up to and not including the "Display Options" title; append the "Display Options" title and everything after it to `rightCol`.

### 3. Update `#adv-content` CSS

```css
/* Current */
#adv-content {
    padding: 0 2rem 1.5rem;
    border-top: 1px solid #2a2a2e;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 0 2rem;
}

/* New */
#adv-content {
    padding: 0 2rem 1.5rem;
    border-top: 1px solid #2a2a2e;
    display: flex;
    gap: 2rem;
    align-items: flex-start;
}
```

### 4. New column CSS

```css
.adv-col {
    flex: 1;
    min-width: 0;
}

/* On narrow screens: stack */
@media (max-width: 900px) {
    #adv-content {
        flex-direction: column;
    }
}
```

### 5. Remove `grid-column: 1 / -1` from elements that no longer need it

`.adv-group-title` and `.section-order-list` currently use `grid-column: 1 / -1` to span the old multi-column grid. Once `#adv-content` is a simple flex row, those rules become no-ops and can be removed or narrowed.

---

## Verification

1. Open Advanced Settings with a parsed Province Log on a wide screen — section list appears left, all Display Options checkboxes appear right.
2. Narrow the browser below 900 px — columns stack vertically (Sections above Display Options).
3. Repeat for Kingdom News and Province News modes.
4. Confirm all existing checkboxes, reorder controls, and toggles still function correctly.

