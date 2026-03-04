---
id: Uto-ervc
status: closed
deps: []
links: []
created: 2026-03-03T22:12:19Z
type: bug
priority: 1
assignee: Jamie Walls
tags: [css, ui]
---
# Layout: fix Advanced Settings drifting down as Formatted Output grows

On wide screens, the Advanced Settings panel drifts down the page as the Formatted Output textarea is resized taller. It should stay fixed directly below the Input Text box at all times.

Root cause:
The current grid uses .output-section { grid-row: 1 / 3 } to span both rows so it fills the full height of the left column. When the output textarea grows, CSS grid must expand the total row height to fit the spanning item. Because both rows are implicit auto, the algorithm grows row 1 along with the output section, pushing the row 2 start position (where .adv-panel sits) further down the page. align-self: start on .adv-panel only prevents the panel from stretching inside its cell — it does not prevent the cell itself from being pushed down.

Fix — wrap the left column contents in HTML and use flexbox:

index.html: wrap .input-section and .adv-panel in a new <div class="left-col">:
  <main class="container">
    <div class="left-col">
      <section class="input-section"> ... </section>
      <section id="advanced-settings" class="adv-panel hidden" ...> ... </section>
    </div>
    <section class="output-section"> ... </section>
  </main>

css/main.css changes:
  - .left-col: display flex, flex-direction column, gap 2rem (so input and adv-panel stack naturally)
  - On wide screens (>=768px): main grid has grid-template-columns: 1fr 1fr and align-items: start; no row-spanning needed
  - Remove the explicit grid-column/grid-row overrides on .input-section, .output-section, .adv-panel from the >=768px media query (they are no longer needed once left-col handles the stacking)
  - .adv-panel no longer needs align-self: start (left-col flexbox handles it)
  - On mobile (<768px): left-col has no special styles — flex column is the same as block stacking, so input then adv-panel appear naturally. But since the DOM order is left-col (input + adv) then output, mobile will show: input, adv-panel, output. If that order is wrong for mobile, set left-col to display: contents on mobile so its children participate in the main grid/flow directly — or simply reorder the DOM so output-section comes before adv-panel inside left-col. Preferred: keep DOM order as input → output → adv-panel on mobile. One way: on mobile use order property or display: contents on left-col.

Mobile order requirement: input (top), output (middle), adv-panel (bottom). On wide: left col = input + adv-panel stacked, right col = output.

