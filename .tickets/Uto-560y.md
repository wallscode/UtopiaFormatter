---
id: Uto-560y
status: closed
deps: []
links: []
created: 2026-03-03T01:06:49Z
type: feature
priority: 2
assignee: Jamie Walls
---
# Province Logs: add Show failed spell attempts toggle (default off) to Advanced Settings

Add a 'Show failed spell attempts' checkbox to the Province Logs Advanced Settings column, immediately below the existing 'Show failed thievery attempts' toggle. Default value is false (unchecked), meaning failed spell attempts are hidden by default.

When unchecked, the following should be removed from the output:
1. Spell Targets — for each province entry:
   - Remove the 4-space-indented 'Failed: N' line (no secondary content, unlike thievery)
   - Strip the '(N failed)' annotation from the province header line
     Before: 'Back From The Edge (4:8) — 24 casts (2 failed):'
     After:  'Back From The Edge (4:8) — 24 casts:'
2. Spell by Spell Type — remove the entire 'Failed — N casts:' block (header + all province sub-lines)

Note: unlike thievery, there is no top-level summary line in Spell Summary to remove — the failed count only appears in Spell Targets and Spell by Spell Type.

## Design

**advSettings (ui.js ~line 62):**
Add showFailedSpellAttempts: false to advSettings.provinceLogs alongside showFailedThievery.

**UI render (ui.js renderProvinceLogsSettings, ~line 952):**
After the failedGroup block for showFailedThievery, add a parallel block:
  const failedSpellGroup = document.createElement('div');
  failedSpellGroup.className = 'adv-group';
  const failedSpellLabel = document.createElement('label');
  failedSpellLabel.htmlFor = 'adv-pl-showFailedSpellAttempts';
  const failedSpellCheckbox = document.createElement('input');
  failedSpellCheckbox.type = 'checkbox';
  failedSpellCheckbox.id = 'adv-pl-showFailedSpellAttempts';
  failedSpellCheckbox.checked = advSettings.provinceLogs.showFailedSpellAttempts;
  failedSpellCheckbox.addEventListener('change', () => {
      advSettings.provinceLogs.showFailedSpellAttempts = failedSpellCheckbox.checked;
      triggerReparse();
  });
  failedSpellLabel.appendChild(failedSpellCheckbox);
  failedSpellLabel.appendChild(document.createTextNode(' Show failed spell attempts'));
  failedSpellGroup.appendChild(failedSpellLabel);
  rightCol.appendChild(failedSpellGroup);

**applyProvinceLogsSettings (ui.js ~line 1320):**
Add a new guard block after the showFailedThievery block:
  if (\!advSettings.provinceLogs.showFailedSpellAttempts) {
      // Spell Targets: remove 'Failed: N' lines
      output = output.split('\n').filter(line => \!/^    Failed: \d+/.test(line)).join('\n');
      // Spell Targets: strip '(N failed)' from province header lines ending with colon
      output = output.split('\n').map(line => line.replace(/ \(\d+ failed\)(?=:$)/, '')).join('\n');
      // Spell by Spell Type: remove entire 'Failed — N casts:' block and its sub-lines
      let skipBlock = false;
      output = output.split('\n').filter(line => {
          if (/^  Failed — \d+ casts:/.test(line)) { skipBlock = true; return false; }
          if (skipBlock && /^    /.test(line)) { return false; }
          skipBlock = false;
          return true;
      }).join('\n');
  }

Note: the Spell Targets Failed line regex /^    Failed: \d+/ will also match Thievery Targets Failed lines. Since showFailedThievery and showFailedSpellAttempts are independent toggles, this overlap is acceptable — if showFailedThievery is true but showFailedSpellAttempts is false, the spell filter will also suppress any remaining Thievery Targets Failed lines that were not already removed. To avoid this, scope the Spell Targets pass to lines within the Spell Targets section only, OR use a more specific regex. The safest approach: check that the Thievery block already ran if showFailedThievery is also false. OR, since both 'Failed: N' patterns are identical in format, accept the overlap as harmless (both sections should be filtered together when both toggles are off).

Actually the cleanest fix: rename the shared regex and run it once when EITHER toggle is off:
  if (\!advSettings.provinceLogs.showFailedThievery || \!advSettings.provinceLogs.showFailedSpellAttempts) {
      output = output.split('\n').filter(line => \!/^    Failed: \d+/.test(line)).join('\n');
      output = output.split('\n').map(line => line.replace(/ \(\d+ failed\)(?=:$)/, '')).join('\n');
  }
Then run the Thievery by Op Type block removal only when showFailedThievery is false, and the Spell by Spell Type block removal only when showFailedSpellAttempts is false. Refactor accordingly.

## Acceptance Criteria

- [ ] 'Show failed spell attempts' checkbox added to Province Logs Advanced Settings, below 'Show failed thievery attempts'
- [ ] Default value is false (hidden by default)
- [ ] When unchecked: 'Failed: N' lines removed from Spell Targets
- [ ] When unchecked: '(N failed)' stripped from Spell Targets province header lines
- [ ] When unchecked: entire 'Failed — N casts:' block removed from Spell by Spell Type
- [ ] showFailedThievery and showFailedSpellAttempts operate independently
- [ ] No regression on showFailedThievery behavior
- [ ] applyProvinceLogsSettings tests updated to cover new toggle
- [ ] All tests pass

