---
id: Uto-vqwb
status: closed
deps: []
links: []
created: 2026-03-01T14:00:04Z
type: task
priority: 2
assignee: Jamie Walls
---
# Header: add scroll_blue.png as site logo

## Goal

Display `scroll_blue.png` as a small decorative logo in the site header,
sitting to the left of the title text. Move the file from the repo root
to `img/` (the standard location for image assets in a static site).

---

## Current state

```
scroll_blue.png          ← repo root (1024 × 1024 px, RGBA PNG)
```

`index.html` header:

```html
<header>
    <div class="header-content">
        <div class="header-text">
            <h1>Utopia News &amp; Logs Parser</h1>
            <p>Clean, summarize, and format text for the Utopia Kingdom Forum</p>
        </div>
    </div>
</header>
```

`css/main.css` — `header` is `text-align: center`. `.header-content` and
`.header-text` have no existing CSS rules.

---

## Implementation

### 1. Move the file

```
scroll_blue.png  →  img/scroll_blue.png
```

Use `git mv` so the rename is tracked:

```bash
mkdir img
git mv scroll_blue.png img/scroll_blue.png
```

### 2. Update `index.html`

Add the `<img>` tag inside `.header-content`, before `.header-text`:

```html
<header>
    <div class="header-content">
        <img src="img/scroll_blue.png" alt="Utopia scroll logo" class="site-logo">
        <div class="header-text">
            <h1>Utopia News &amp; Logs Parser</h1>
            <p>Clean, summarize, and format text for the Utopia Kingdom Forum</p>
        </div>
    </div>
</header>
```

### 3. Add CSS — `css/main.css`

Make `.header-content` a flex row so the logo sits beside the text block.
Add the `.site-logo` rule. Both additions go in the `/* Header styling */`
section after the `header { }` rule:

```css
.header-content {
    display: inline-flex;
    align-items: center;
    gap: 1rem;
}

.site-logo {
    width: 52px;
    height: 52px;
    object-fit: contain;
    flex-shrink: 0;
}
```

`inline-flex` on `.header-content` keeps the whole group centred within the
`text-align: center` header without needing to change the header itself.

---

## Notes

- The favicon files (`favicon.ico`, `favicon-*.png`, `android-chrome-*.png`,
  `apple-touch-icon.png`) remain in the repo root — their `<link>` tags use
  absolute paths (`/favicon-32x32.png`) and moving them would break those
  references without a matching update. The `scroll_blue.png` move to `img/`
  is safe because it has no existing references.
- No test changes are needed.

---

## Manual verification

1. Load the site in a browser — confirm the scroll image appears to the left
   of the heading at roughly 52 × 52 px.
2. Resize to mobile width (≤ 768 px) — confirm the logo and heading remain
   reasonably proportioned.
