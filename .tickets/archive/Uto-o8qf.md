---
id: Uto-o8qf
status: closed
deps: []
links: []
created: 2026-03-03T22:13:55Z
type: bug
priority: 1
assignee: Jamie Walls
tags: [css, ui]
---
# Layout: fix Advanced Settings drifting down as Formatted Output grows

On wide screens, the Advanced Settings panel drifts down the page as the Formatted Output textarea is resized taller. It should stay fixed directly below the Input Text box at all times.

Root cause:
The current grid uses .output-section { grid-row: 1 / 3 } to span both rows. When the output textarea grows, CSS grid expands row 1 to fit the spanning item, pushing the row 2 start position (where .adv-panel lives) down the page. align-self: start prevents the panel from stretching inside its cell but cannot stop the cell from moving.

Fix:

index.html — wrap .input-section and .adv-panel in a new <div class="left-col">:
  <main class="container">
    <div class="left-col">
      <section class="input-section"> ... </section>
      <section id="advanced-settings" class="adv-panel hidden" ...> ... </section>
    </div>
    <section class="output-section"> ... </section>
  </main>

css/main.css:

Wide screens (>=768px):
  - main: grid-template-columns: 1fr 1fr; align-items: start (no row-spanning needed)
  - .left-col: display flex; flex-direction: column; gap: 2rem
    → input-section and adv-panel stack naturally, completely independent of output height
  - Remove the existing grid-column / grid-row overrides on .input-section, .output-section, .adv-panel

Mobile (<768px):
  The DOM order inside left-col is input → adv-panel, followed by output-section outside it.
  Without intervention mobile shows: input → adv-panel → output (wrong).
  Required mobile order: input → output → adv-panel.

  Solution — on mobile set left-col to display: contents so its children
  participate directly in the main grid, then use CSS order to enforce visual order:
    .left-col { display: contents }          (mobile only, i.e. outside the >=768px block)
    .input-section { order: 1 }              (mobile only)
    .output-section { order: 2 }             (mobile only)
    .adv-panel { order: 3 }                  (mobile only)
  main is already a single-column grid on mobile so order on grid items works correctly.
  These order rules must be scoped to max-width: 767px (or simply outside the >=768px block)
  so they do not affect the wide layout where left-col is a flex container.

