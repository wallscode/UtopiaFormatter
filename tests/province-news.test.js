/**
 * Province News Parser Tests
 * Uses the real-world ProvinceNewsExample.txt file.
 */

const fs = require('fs');
const path = require('path');

// Load parser (browser-compatible module pattern)
const {
    parseProvinceNews,
    detectInputType
} = require('../js/parser.js');

const examplePath = path.join(__dirname, '..', 'ProvinceNewsExample.txt');
const exampleText = fs.readFileSync(examplePath, 'utf8');

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  PASS: ${message}`);
        passed++;
    } else {
        console.error(`  FAIL: ${message}`);
        failed++;
    }
}

function assertContains(text, substring, message) {
    assert(text.includes(substring), message || `output contains "${substring}"`);
}

function assertNotContains(text, substring, message) {
    assert(!text.includes(substring), message || `output does not contain "${substring}"`);
}

// =============================================================================
// Detection tests
// =============================================================================

console.log('\n--- Detection ---');
assert(detectInputType(exampleText) === 'province-news', 'ProvinceNewsExample.txt detected as province-news');
assert(detectInputType('February 1 of YR1\tOur people decided to explore') === 'province-news', 'Simple province news line detected');
assert(detectInputType('You have ordered your troops to march') !== 'province-news', 'Province Logs text not detected as province-news');

// =============================================================================
// Full parse of example file
// =============================================================================

const output = parseProvinceNews(exampleText);
console.log('\n--- Header ---');
assertContains(output, 'Province News Report', 'Output starts with Province News Report');
assertContains(output, 'February 1 of YR1', 'First date present');
assertContains(output, 'February 4 of YR3', 'Last date present');

// =============================================================================
// Daily Login Bonus (combines Monthly Land + Monthly Income + login events)
// =============================================================================

console.log('\n--- Daily Login Bonus ---');
assertContains(output, 'Daily Login Bonus:', 'Daily Login Bonus section present');
// Monthly land total: YR1 Feb+Mar+Apr+May+Jun=75, YR2 Feb+Apr+May+Jun=80, YR3 Jan+Feb=50 → 205
assertContains(output, '205 acres', 'Daily Login Bonus total acres is 205');
// Monthly income gold and books should be totalled
assertContains(output, 'gold coins', 'Daily Login Bonus gold present');
assertContains(output, 'science books', 'Daily Login Bonus books present');

// =============================================================================
// Scientists Gained
// =============================================================================

console.log('\n--- Scientists Gained ---');
assertContains(output, 'Scientists Gained:', 'Scientists Gained section present');
// Scientists in the file: Hayyie (Economy), Ezzerland (Economy) = 2 Economy
//   Gearhead + others = Arcane Arts, Thalius = Military, etc.
assertContains(output, 'Economy: 2', 'Economy scientist count');
assertContains(output, 'Military: 1', 'Military scientist count');

// =============================================================================
// Aid Received
// =============================================================================

console.log('\n--- Aid Received ---');
assertContains(output, 'Aid Received:', 'Aid Received section present');
assertContains(output, 'runes', 'Runes aid present');
assertContains(output, 'gold coins', 'Gold aid present');
assertContains(output, 'bushels', 'Bushels aid present');
assertContains(output, 'explore pool acres', 'Explore Pool aid present');
assertContains(output, '166 explore pool acres', 'Explore pool 166 acres');
assertContains(output, '84 lost in transit', 'Explore pool 84 acres lost');

// =============================================================================
// Resources Stolen — now inside Thievery Impacts (Uto-hb3m)
// =============================================================================

console.log('\n--- Resources Stolen (in Thievery Impacts) ---');
assertNotContains(output, 'Resources Stolen:', 'Resources Stolen no longer a standalone section');
assertContains(output, 'runes stolen', 'Stolen runes inside Thievery Impacts');
// Gold was stolen: 1,344 gold coins (April 10 of YR1)
assertContains(output, 'gold coins stolen', 'Stolen gold inside Thievery Impacts');

// =============================================================================
// Thievery Impacts
// =============================================================================

console.log('\n--- Thievery Impacts ---');
assertContains(output, 'Thievery Impacts:', 'Thievery Impacts section present');
assertContains(output, 'operations detected', 'Thievery detected count present');
assertContains(output, 'from unknown sources', 'Unknown sources count present');
assertContains(output, 'operations intercepted by Shadowlight', 'Shadowlight interceptions present');
// Shadowlight intercepts in example (thief-prevented lines, not attacker-ID lines):
// At my signal_ (Feb YR2), Please Use Luge (May YR2), RenotS024 (May YR2),
// Sapper of Absalom (Jun YR2), Djinn of Wands (Jan YR3), swoop (Jan YR3),
// Skum Phoenix (Feb YR3) = 7  (Rhasta is an attacker-ID reveal, not a thief intercept)
assertContains(output, '7 operations intercepted by Shadowlight', 'Correct Shadowlight intercept count (7)');
// Incite Riots (was Rioting)
assertContains(output, 'Incite Riots:', 'Incite Riots line present in Thievery Impacts');
// Sabotage Wizards (was Mana disruptions)
assertContains(output, 'Sabotage Wizards:', 'Sabotage Wizards line present in Thievery Impacts');
assertContains(output, 'Sabotage Wizards: 12 occurrences', 'Correct Sabotage Wizards count (12)');
// Propaganda (was Troop desertions)
assertContains(output, 'Propaganda:', 'Propaganda line present');
// Failed propaganda
assertContains(output, 'Failed propaganda:', 'Failed propaganda line present');
// Bribe General (was Turncoat general)
assertContains(output, 'Bribe General:', 'Bribe General line present');

// =============================================================================
// Spell Impacts (merged section: spell attempts + magical hazards)
// =============================================================================

console.log('\n--- Spell Impacts ---');
assertContains(output, 'Spell Impacts:', 'Spell Impacts section present');
assertContains(output, 'attempts', 'Spell attempt count present');
// Various spell attempts throughout the file
// Some have Faery prefix (still count as spell attempts)
assertContains(output, 'Synchronized Snow Shoveling (3:7)', 'Spell caster Synchronized Snow Shoveling listed');
assertContains(output, 'To resurrect the soul (5:5)', 'Spell caster To resurrect the soul listed');
// Meteor shower (was in Hazards & Events)
assertContains(output, 'Meteor shower:', 'Meteor shower line present');
// Pitfalls — 3 occurrences × (19 + 10 + 6) = 35 days
assertContains(output, 'Pitfalls: 3 occurrences, 35 days', 'Pitfalls with occurrence count and total days');
// Greed (was Soldier Upkeep Demands)
assertContains(output, 'Greed:', 'Greed line present');

// =============================================================================
// Shadowlight Thief IDs (Uto-hb3m: renamed from Shadowlight Attacker IDs)
// =============================================================================

console.log('\n--- Shadowlight Thief IDs ---');
assertContains(output, 'Shadowlight Thief IDs:', 'Shadowlight Thief IDs section present');
assertContains(output, 'Arancini (2:4)', 'Arancini attacker ID');
assertContains(output, '10_Kentucky (3:3)', '10_Kentucky attacker ID');
assertContains(output, 'Flandern (3:3)', 'Flandern attacker ID');
assertContains(output, 'Hammerhide (3:9)', 'Hammerhide attacker ID');

// =============================================================================
// Attacks Suffered
// =============================================================================

console.log('\n--- Attacks Suffered ---');
assertContains(output, 'Attacks Suffered:', 'Attacks Suffered section present');
assertContains(output, 'acres lost', 'Acres lost in header');
// Attack from Odd-lympics (3:7) - 56 acres
assertContains(output, 'Odd-lympics (3:7): 56 acres', 'Odd-lympics attack entry');
// Learn attacks should show books (learn)
assertContains(output, 'books (learn)', 'Learn attack entry present');

// =============================================================================
// War Outcomes
// =============================================================================

console.log('\n--- War Outcomes ---');
assertContains(output, 'War Outcomes:', 'War Outcomes section present');
assertContains(output, 'Land given up: 90 acres (30 to enemies, 60 redistributed)', 'War land penalty correct');
assertContains(output, '1,140 building credits', 'War resource bonus building credits');
assertContains(output, '1,710 specialist credits', 'War resource bonus specialist credits');
assertContains(output, '22,152 science books', 'War resource bonus science books');

// =============================================================================
// Section renames — old section names must not appear
// =============================================================================

console.log('\n--- Renamed sections absent ---');
assertNotContains(output, 'Monthly Land:', 'Old "Monthly Land:" section absent');
assertNotContains(output, 'Monthly Income:', 'Old "Monthly Income:" section absent');
assertNotContains(output, 'Scientists (', 'Old "Scientists (N total):" absent');
assertNotContains(output, 'Spell Attempts:', 'Old "Spell Attempts:" section absent');
assertNotContains(output, 'Hazards & Events:', 'Old "Hazards & Events:" section absent');
assertNotContains(output, 'Thievery:', 'Old "Thievery:" section label absent (replaced by "Thievery Impacts:")');
assertNotContains(output, 'Resources Stolen:', 'Old standalone "Resources Stolen:" section absent');
assertNotContains(output, 'Shadowlight Attacker IDs:', 'Old "Shadowlight Attacker IDs:" absent (renamed to "Shadowlight Thief IDs:")');

// =============================================================================
// Edge cases
// =============================================================================

console.log('\n--- Edge Cases ---');

// Non-date lines should be ignored
const withNoise = 'example text which should be ignored\n\nFebruary 1 of YR1\tOur people decided to explore new territories and have settled 5 acres of new land.';
const noiseOutput = parseProvinceNews(withNoise);
assertContains(noiseOutput, 'Daily Login Bonus:', 'Non-date lines are ignored');
assertContains(noiseOutput, '5 acres', 'Event from date line is parsed');

// Faery prefix is stripped — spell attempt still counted
const faeryLine = "February 1 of YR1\tYour spell is disrupted by the natural leyline energies surrounding the target's Faery province, causing it to fail completely. Our mages noticed a possible spell attempt by SomeProvince (1:1) causing trouble on our lands!";
const faeryOutput = parseProvinceNews(faeryLine);
assertContains(faeryOutput, '1 attempt', 'Faery-prefixed spell attempt still counted');

// Instant mana recovery = 0 days but counted
const manaLine = "February 1 of YR1\tOur Wizards' ability to regain their mana has been disrupted! Fortunately, our Wizards recovered quickly and remain unaffected.";
const manaOutput = parseProvinceNews(manaLine);
assertContains(manaOutput, 'Sabotage Wizards: 1 occurrence, 0 days', 'Instant mana recovery counted but 0 days');

// =============================================================================
// Summary
// =============================================================================

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
if (failed > 0) process.exit(1);
