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
// Monthly Land
// =============================================================================

console.log('\n--- Monthly Land ---');
assertContains(output, 'Monthly Land:', 'Monthly Land section present');
// YR1: Feb(15), Mar(15), Apr(15), May(15), Jun(15) = 75
// YR2: Feb(20), Apr(20), May(20), Jun(20) = 80  (missing Mar - not in file)
// YR3: Jan(25), Feb(25) = 50
// Total = 205
assertContains(output, 'Total: 205 acres', 'Monthly Land total is 205 acres');
assertContains(output, 'February YR1: 15 acres', 'Feb YR1 land entry');
assertContains(output, 'February YR2: 20 acres', 'Feb YR2 land entry');
assertContains(output, 'February YR3: 25 acres', 'Feb YR3 land entry');

// =============================================================================
// Monthly Income
// =============================================================================

console.log('\n--- Monthly Income ---');
assertContains(output, 'Monthly Income:', 'Monthly Income section present');
assertContains(output, 'February YR1: 53,846 gold, 4,260 books', 'Feb YR1 income');
assertContains(output, 'March YR1: 23,263 gold, 2,856 books', 'Mar YR1 income');

// =============================================================================
// Scientists
// =============================================================================

console.log('\n--- Scientists ---');
assertContains(output, 'Scientists (', 'Scientists section present');
assertContains(output, 'Hayyie (Economy)', 'Hayyie scientist');
assertContains(output, 'Ezzerland (Economy)', 'Ezzerland scientist');
assertContains(output, 'Gearhead (Arcane Arts)', 'Gearhead scientist');
assertContains(output, 'Thalius (Military)', 'Thalius scientist');
// Verify count: Hayyie, Ezzerland, Gearhead, Thalius, AmrasArFeiniel, Old Sam, Azalon, Smiles, Mansoor = 9
assertContains(output, 'Scientists (9 total):', 'Correct scientist count (9)');

// =============================================================================
// Aid Received
// =============================================================================

console.log('\n--- Aid Received ---');
assertContains(output, 'Aid Received:', 'Aid Received section present');
assertContains(output, 'Runes:', 'Runes aid present');
// Multiple rune shipments from example
assertContains(output, 'Gold:', 'Gold aid present');
assertContains(output, 'Bushels:', 'Bushels aid present');
assertContains(output, 'Explore Pool:', 'Explore Pool aid present');
assertContains(output, '166 acres', 'Explore pool 166 acres');
assertContains(output, '84 acres lost in transit', 'Explore pool 84 acres lost');

// =============================================================================
// Resources Stolen
// =============================================================================

console.log('\n--- Resources Stolen ---');
assertContains(output, 'Resources Stolen:', 'Resources Stolen section present');
assertContains(output, 'runes', 'Stolen runes present');
// Gold was stolen: 1,344 gold coins (April 10 of YR1)
assertContains(output, 'gold coins', 'Stolen gold present');

// =============================================================================
// Thievery
// =============================================================================

console.log('\n--- Thievery ---');
assertContains(output, 'Thievery:', 'Thievery section present');
assertContains(output, 'operations detected', 'Thievery detected count present');
assertContains(output, 'from unknown sources', 'Unknown sources count present');
assertContains(output, 'operations intercepted by Shadowlight', 'Shadowlight interceptions present');
// Shadowlight intercepts in example (thief-prevented lines, not attacker-ID lines):
// At my signal_ (Feb YR2), Please Use Luge (May YR2), RenotS024 (May YR2),
// Sapper of Absalom (Jun YR2), Djinn of Wands (Jan YR3), swoop (Jan YR3),
// Skum Phoenix (Feb YR3) = 7  (Rhasta is an attacker-ID reveal, not a thief intercept)
assertContains(output, '7 operations intercepted by Shadowlight', 'Correct Shadowlight intercept count (7)');

// =============================================================================
// Spell Attempts
// =============================================================================

console.log('\n--- Spell Attempts ---');
assertContains(output, 'Spell Attempts:', 'Spell Attempts section present');
// Various spell attempts throughout the file
// Some have Faery prefix (still count as spell attempts)
assertContains(output, 'Synchronized Snow Shoveling (3:7)', 'Spell caster Synchronized Snow Shoveling listed');
assertContains(output, 'To resurrect the soul (5:5)', 'Spell caster To resurrect the soul listed');

// =============================================================================
// Shadowlight Attacker IDs
// =============================================================================

console.log('\n--- Shadowlight Attacker IDs ---');
assertContains(output, 'Shadowlight Attacker IDs:', 'Shadowlight Attacker IDs section present');
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
// Hazards & Events
// =============================================================================

console.log('\n--- Hazards & Events ---');
assertContains(output, 'Hazards & Events:', 'Hazards & Events section present');
assertContains(output, 'Meteor shower:', 'Meteor shower line present');
assertContains(output, 'days of damage', 'Meteor damage days present');
assertContains(output, 'total casualties', 'Meteor casualties present');
assertContains(output, 'Rioting:', 'Rioting line present');
assertContains(output, 'Pitfalls:', 'Pitfalls line present');
assertContains(output, 'Mana disruptions:', 'Mana disruptions line present');
assertContains(output, 'Troop desertions:', 'Troop desertions line present');
assertContains(output, 'Turncoat general(s) executed:', 'Turncoat generals line present');
assertContains(output, 'Failed propaganda attempts:', 'Failed propaganda line present');
assertContains(output, 'Soldier upkeep demands:', 'Soldier upkeep line present');

// Specific mana disruption count (verify including instant-recovery events)
// Mar4, Mar10, Mar15(instant), Mar17, Mar19, Apr2(instant), Apr3, Apr9, Apr18, Apr23, May4, May10 = 12 total
assertContains(output, 'Mana disruptions: 12', 'Correct mana disruption count (12)');

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
// Edge cases
// =============================================================================

console.log('\n--- Edge Cases ---');

// Non-date lines should be ignored
const withNoise = 'example text which should be ignored\n\nFebruary 1 of YR1\tOur people decided to explore new territories and have settled 5 acres of new land.';
const noiseOutput = parseProvinceNews(withNoise);
assertContains(noiseOutput, 'Monthly Land:', 'Non-date lines are ignored');
assertContains(noiseOutput, '5 acres', 'Event from date line is parsed');

// Faery prefix is stripped — spell attempt still counted
const faeryLine = "February 1 of YR1\tYour spell is disrupted by the natural leyline energies surrounding the target's Faery province, causing it to fail completely. Our mages noticed a possible spell attempt by SomeProvince (1:1) causing trouble on our lands!";
const faeryOutput = parseProvinceNews(faeryLine);
assertContains(faeryOutput, 'Spell Attempts: 1', 'Faery-prefixed spell attempt still counted');

// Instant mana recovery = 0 days but counted
const manaLine = "February 1 of YR1\tOur Wizards' ability to regain their mana has been disrupted! Fortunately, our Wizards recovered quickly and remain unaffected.";
const manaOutput = parseProvinceNews(manaLine);
assertContains(manaOutput, 'Mana disruptions: 1 (affecting 0 days total)', 'Instant mana recovery counted but 0 days');

// =============================================================================
// Summary
// =============================================================================

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
if (failed > 0) process.exit(1);
