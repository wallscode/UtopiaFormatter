---
id: Uto-73ib
status: closed
deps: []
links: []
created: 2026-03-03T01:46:22Z
type: feature
priority: 2
assignee: Jamie Walls
---
# Province Logs Advanced Settings: group Display Options toggles by category

The Province Logs Display Options right column currently lists all toggles flat under a single 'Display Options' heading. Group them under four sub-category headings in this order:

Thievery and Spells:
  - Show averages
  - Show failed thievery attempts
  - Show failed spell attempts
  - Show thieves lost in successful operations

Construction & Exploring:
  - Show razed building summary
  - Show exploration soldier & cost details

Military:
  - Show troops released from duty
  - Show draft percentage
  - Show draft rate setting
  - Show military wages

Miscellaneous:
  - Copy for Discord

## Design

**renderProvinceLogsSettings in ui.js (~line 909):**

Keep the top-level 'Display Options' adv-group-title as-is. Insert sub-category headings between groups of toggles using a new CSS class 'adv-subgroup-title' (or reuse adv-group-title at the sub level — see CSS note below).

Insertion points (relative to current order):
1. Before avgGroup: insert sub-heading 'Thievery and Spells'
2. Before razedGroup: insert sub-heading 'Construction & Exploring'
3. Before releaseGroup: insert sub-heading 'Military'
4. Before plDiscordGroup: insert sub-heading 'Miscellaneous'

Each sub-heading is a div appended to rightCol:
  const subTitle = document.createElement('div');
  subTitle.className = 'adv-subgroup-title';
  subTitle.textContent = 'Category Name';
  rightCol.appendChild(subTitle);

**CSS (main.css):**
Add .adv-subgroup-title styled as a smaller, indented category label distinct from adv-group-title:
  .adv-subgroup-title {
      font-size: 0.7rem;
      font-weight: 600;
      color: #5a6270;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0.75rem 0 0.25rem;
      padding-left: 0.25rem;
  }
  .adv-subgroup-title:first-of-type { margin-top: 0.5rem; }

The sub-heading should visually nest under 'Display Options' while being clearly distinct from it (smaller, dimmer, less letter-spacing than adv-group-title).

## Acceptance Criteria

- [ ] Four sub-category headings appear under 'Display Options' in the Province Logs right column
- [ ] Toggles are grouped correctly under each heading per the specification
- [ ] All toggles remain functional
- [ ] No test changes required (purely visual/UI change)
- [ ] Visually distinct from the top-level 'Display Options' title

