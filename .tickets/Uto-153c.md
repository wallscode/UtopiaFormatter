---
id: Uto-153c
status: open
deps: []
links: []
created: 2026-03-01T15:15:32Z
type: task
priority: 2
assignee: Jamie Walls
---
# Province News: remove total casualties from Meteor Shower output

## Problem

The Meteor Shower line in the Spell Impacts section currently reads:

```
  Meteor shower: 3 days, 142 total casualties (peasants: 89, soldiers: 53)
```

The `X total casualties` figure is redundant — it is simply the sum of the
per-type numbers already listed in parentheses. Showing it adds noise without
adding information.

## Desired output

```
  Meteor shower: 3 days (peasants: 89, soldiers: 53)
```

---

## Current state — `js/parser.js` (~line 2457)

```javascript
if (data.meteorDays > 0) {
    const totalMeteorCas = data.meteorCasualties.peasants + data.meteorCasualties.soldiers +
                           data.meteorCasualties.Magicians + data.meteorCasualties.Beastmasters;
    const casParts = [];
    if (data.meteorCasualties.peasants > 0)     casParts.push(`peasants: ${formatNumber(data.meteorCasualties.peasants)}`);
    if (data.meteorCasualties.soldiers > 0)     casParts.push(`soldiers: ${formatNumber(data.meteorCasualties.soldiers)}`);
    if (data.meteorCasualties.Magicians > 0)    casParts.push(`Magicians: ${formatNumber(data.meteorCasualties.Magicians)}`);
    if (data.meteorCasualties.Beastmasters > 0) casParts.push(`Beastmasters: ${formatNumber(data.meteorCasualties.Beastmasters)}`);
    out.push(`  Meteor shower: ${data.meteorDays} days, ${formatNumber(totalMeteorCas)} total casualties (${casParts.join(', ')})`);
}
```

---

## Implementation — `js/parser.js` only, two lines changed

```javascript
// Before
const totalMeteorCas = data.meteorCasualties.peasants + data.meteorCasualties.soldiers +
                       data.meteorCasualties.Magicians + data.meteorCasualties.Beastmasters;
const casParts = [];
// ...
out.push(`  Meteor shower: ${data.meteorDays} days, ${formatNumber(totalMeteorCas)} total casualties (${casParts.join(', ')})`);

// After (remove totalMeteorCas, update the push line)
const casParts = [];
// ...
out.push(`  Meteor shower: ${data.meteorDays} days${casParts.length ? ` (${casParts.join(', ')})` : ''}`);
```

Notes:
- `totalMeteorCas` is only used in the output line, so it can be deleted entirely.
- The `casParts.length` guard keeps the output clean when there are no
  casualties to report (edge case where meteor days > 0 but all casualty
  counts are 0).

---

## Tests — `tests/province-news.test.js` (~line 143)

Remove the assertion that checks for `'total casualties'`:

```javascript
// Before
assertContains(output, 'Meteor shower:', 'Meteor shower line present');
assertContains(output, 'total casualties', 'Meteor casualties present');

// After
assertContains(output, 'Meteor shower:', 'Meteor shower line present');
```

Run `tests/province-news.test.js` and verify it passes.
