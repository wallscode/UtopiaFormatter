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

const examplePath = path.join(__dirname, 'ProvinceNewsExample.txt');
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
assertContains(output, 'War Result: Defeat', 'War result defeat indicated');
assertContains(output, 'War Result: Victory', 'War result victory indicated');
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

// =============================================================================
// applyProvinceNewsSettings unit tests
// =============================================================================

console.log('\n--- applyProvinceNewsSettings ---');

const ui = require('../js/ui.js');
const { applyProvinceNewsSettings, advSettings } = ui;

const origPN = JSON.parse(JSON.stringify(advSettings.provinceNews));

function resetPN() {
    advSettings.provinceNews.sectionOrder   = ['Thievery Impacts', 'Spell Impacts', 'Aid Received'];
    advSettings.provinceNews.visible        = { 'Thievery Impacts': true, 'Spell Impacts': true, 'Aid Received': true };
    advSettings.provinceNews.showSourceIdentifiers = true;
    advSettings.provinceNews.discordCopy    = false;
}

// Synthetic province news output — sections separated by \n\n + name (no colon needed as marker)
const pnSynth = [
    'Province News Report',
    'Feb 1 YR1 to Feb 4 YR3',
    '',
    'Thievery Impacts:',
    '  7 operations detected',
    '    Attacker Province (1:1)',
    '  from unknown sources',
    '',
    'Spell Impacts:',
    '  3 attempts',
    '    Caster Province (2:2)',
    '',
    'Aid Received:',
    '  5,000 gold coins'
].join('\n');

// showSourceIdentifiers = false strips 4-space-indented attacker lines
resetPN();
advSettings.provinceNews.showSourceIdentifiers = false;
let pnResult = applyProvinceNewsSettings(pnSynth);
assert(!pnResult.includes('Attacker Province (1:1)'), 'showSourceIdentifiers=false removes attacker ID from Thievery Impacts');
assert(!pnResult.includes('Caster Province (2:2)'), 'showSourceIdentifiers=false removes caster ID from Spell Impacts');
assert(pnResult.includes('7 operations detected'), 'showSourceIdentifiers=false keeps non-indented Thievery Impacts lines');

// showSourceIdentifiers = true keeps all lines
resetPN();
advSettings.provinceNews.showSourceIdentifiers = true;
pnResult = applyProvinceNewsSettings(pnSynth);
assert(pnResult.includes('Attacker Province (1:1)'), 'showSourceIdentifiers=true keeps attacker ID lines');
assert(pnResult.includes('Caster Province (2:2)'), 'showSourceIdentifiers=true keeps caster ID lines');

// Section visibility — hide Spell Impacts
resetPN();
advSettings.provinceNews.visible['Spell Impacts'] = false;
pnResult = applyProvinceNewsSettings(pnSynth);
assert(!pnResult.includes('Spell Impacts:'), 'Spell Impacts hidden when visible=false');
assert(pnResult.includes('Thievery Impacts:'), 'Thievery Impacts visible when visible=true');
assert(pnResult.includes('Aid Received:'), 'Aid Received visible when visible=true');

// Section reordering — Aid Received before Thievery Impacts
resetPN();
advSettings.provinceNews.sectionOrder = ['Aid Received', 'Thievery Impacts', 'Spell Impacts'];
pnResult = applyProvinceNewsSettings(pnSynth);
assert(pnResult.indexOf('Aid Received:') < pnResult.indexOf('Thievery Impacts:'), 'Aid Received before Thievery when reordered');

// Restore
Object.assign(advSettings.provinceNews, origPN);

// =============================================================================
// accumulateProvinceNewsData: synthetic line-type unit tests
// Tests individual input line patterns using minimal synthetic inputs.
// Each test sends one or a few tab-delimited Province News lines.
// =============================================================================

console.log('\n--- Synthetic line-type unit tests ---');

const { accumulateProvinceNewsData } = require('../js/parser.js');

function pnLine(event) {
    return `February 1 of YR1\t${event}`;
}

function accum(lines) {
    return accumulateProvinceNewsData(Array.isArray(lines) ? lines.join('\n') : lines);
}

// Aid received — soldiers
(function() {
    const d = accum(pnLine('We have received a shipment of 5,000 soldiers from Ally Province (1:1).'));
    assert(d.aidByResource.soldiers.total === 5000, 'Aid soldiers: total parsed correctly');
    assert(d.aidByResource.soldiers.shipments === 1, 'Aid soldiers: shipment count = 1');
})();

// Stolen bushels
(function() {
    const d = accum(pnLine('1,500 bushels were stolen from our stores!'));
    assert(d.stolen.bushels === 1500, 'Stolen bushels: amount parsed correctly');
})();

// Troop desertions — wizards
(function() {
    const d = accum(pnLine('25 wizards of our wizards abandoned us hoping for a better life!'));
    assert(d.desertions.total === 25, 'Desertion wizards: total = 25');
    assert(d.desertions.byType['wizards'] === 25, 'Desertion wizards: byType entry correct');
})();

// Troop desertions — specialist troops
(function() {
    const d = accum(pnLine('10 of our specialist troops abandoned us hoping for a better life!'));
    assert(d.desertions.total === 10, 'Desertion specialists: total = 10');
    assert(d.desertions.byType['specialist troops'] === 10, 'Desertion specialists: byType entry correct');
})();

// Troop desertions — named type (e.g. Beastmasters)
(function() {
    const d = accum(pnLine('8 Beastmasters abandoned us hoping for a better life!'));
    assert(d.desertions.total === 8, 'Desertion named (Beastmasters): total = 8');
    assert(d.desertions.byType['Beastmasters'] === 8, 'Desertion named (Beastmasters): byType entry correct');
})();

// Multiple desertion types accumulated correctly
(function() {
    const d = accum([
        pnLine('15 wizards of our wizards abandoned us hoping for a better life!'),
        pnLine('5 of our specialist troops abandoned us hoping for a better life!'),
        pnLine('3 Magicians abandoned us hoping for a better life!'),
    ].join('\n'));
    assert(d.desertions.total === 23, 'Multiple desertions: total = 23');
    assert(d.desertions.byType['wizards'] === 15, 'Multiple desertions: wizards = 15');
    assert(d.desertions.byType['specialist troops'] === 5, 'Multiple desertions: specialists = 5');
    assert(d.desertions.byType['Magicians'] === 3, 'Multiple desertions: Magicians = 3');
})();

// Starvation — single event with multiple unit types
(function() {
    const d = accum(pnLine('Our people are starving! We have lost 50 peasants, 10 soldiers, 5 Magicians and 3 thieves.'));
    assert(d.starvation.count === 1, 'Starvation: count = 1');
    assert(d.starvation.total >= 68, 'Starvation: total casualties >= 68 (50+10+5+3)');
    assert(d.starvation.byType['peasants'] === 50, 'Starvation: peasants = 50');
    assert(d.starvation.byType['soldiers'] === 10, 'Starvation: soldiers = 10');
})();

// Daily login bonus — extreme tier
(function() {
    const d = accum(pnLine('Your people appreciate your extreme dedication and have gifted you 15 acres, 1,000 gold coins and 500 science books.'));
    assert(d.loginBonus.extreme === 1, 'Login bonus extreme: tier counted');
    assert(d.loginBonus.acres === 15, 'Login bonus extreme: acres parsed');
    assert(d.loginBonus.gold === 1000, 'Login bonus extreme: gold parsed');
})();

// Daily login bonus — impressive tier
(function() {
    const d = accum(pnLine('Your people appreciate your impressive dedication and have gifted you 10 acres and 500 gold coins.'));
    assert(d.loginBonus.impressive === 1, 'Login bonus impressive: tier counted');
    assert(d.loginBonus.acres === 10, 'Login bonus impressive: acres parsed');
})();

// Turncoat general
(function() {
    const d = accum(pnLine('We have discovered a turncoat general leading our military. He has been executed for treason!'));
    assert(d.turncoatGenerals === 1, 'Turncoat general: counted');
})();

// Failed propaganda
(function() {
    const d = accum(pnLine('Enemies attempted to spread propaganda among our soldiers, but failed to convert any of them.'));
    assert(d.failedPropaganda === 1, 'Failed propaganda: counted');
})();

// Received spells: Greed
(function() {
    const d = accum(pnLine('Enemies have convinced our soldiers to demand more money for upkeep for 7 days.'));
    assert(d.greed.count === 1, 'Greed: count = 1');
    assert(d.greed.totalDays === 7, 'Greed: totalDays = 7');
})();

// Received spells: Pitfalls with multiple occurrences
(function() {
    const d = accum([
        pnLine('Pitfalls are haunting our lands for 14 days.'),
        pnLine('Pitfalls are haunting our lands for 10 days.'),
    ].join('\n'));
    assert(d.pitfalls.count === 2, 'Pitfalls: count = 2');
    assert(d.pitfalls.totalDays === 24, 'Pitfalls: totalDays = 24');
})();

// Received spells: Mana disruption lasting
(function() {
    const d = accum(pnLine("Our Wizards' ability to regain their mana has been disrupted! Our mana recovery will be affected for 5 days!"));
    assert(d.manaDis.count === 1, 'Mana disruption lasting: count = 1');
    assert(d.manaDis.totalDays === 5, 'Mana disruption lasting: totalDays = 5');
})();

// Received spells: Storms (unconfirmed pattern, uses loose regex)
(function() {
    const d = accum(pnLine('Storms will ravage our lands for 3 days!'));
    assert(d.storms.count === 1, 'Storms: count = 1');
    assert(d.storms.totalDays === 3, 'Storms: totalDays = 3');
})();

// Received spells: Chastity (unconfirmed pattern, uses loose regex)
(function() {
    const d = accum(pnLine('Our womenfolk have taken a vow of chastity for 8 days!'));
    assert(d.chastity.count === 1, 'Chastity: count = 1');
    assert(d.chastity.totalDays === 8, 'Chastity: totalDays = 8');
})();

// Received spells: Droughts (unconfirmed pattern, uses loose regex)
(function() {
    const d = accum(pnLine('A drought will reign over our lands for 12 days!'));
    assert(d.droughts.count === 1, 'Droughts: count = 1');
    assert(d.droughts.totalDays === 12, 'Droughts: totalDays = 12');
})();

// Meteor shower damage tick: multiple unit types
(function() {
    const d = accum([
        pnLine('Meteors rain across the lands and kill 20 peasants and 5 soldiers!'),
        pnLine('Meteors rain across the lands and kill 10 Magicians!'),
    ].join('\n'));
    assert(d.meteorDays === 2, 'Meteor ticks: 2 days counted');
    assert(d.meteorCasualties.peasants === 20, 'Meteor casualties: peasants = 20');
    assert(d.meteorCasualties.soldiers === 5, 'Meteor casualties: soldiers = 5');
    assert(d.meteorCasualties.Magicians === 10, 'Meteor casualties: Magicians = 10');
})();

// Spell attempt accumulation from multiple sources
(function() {
    const d = accum([
        pnLine('Our mages noticed a possible spell attempt by Alpha Province (1:1) causing trouble on our lands!'),
        pnLine('Our mages noticed a possible spell attempt by Alpha Province (1:1) causing trouble on our lands!'),
        pnLine('Our mages noticed a possible spell attempt by Beta Province (2:2) causing trouble on our lands!'),
    ].join('\n'));
    assert(d.spellAttempts === 3, 'Spell attempts: total = 3');
    assert(d.spellsBySource['Alpha Province (1:1)'] === 2, 'Spell attempts: Alpha = 2');
    assert(d.spellsBySource['Beta Province (2:2)'] === 1, 'Spell attempts: Beta = 1');
})();

// Attacks suffered: acres vs books
(function() {
    const d = accum([
        pnLine('Forces from Raider (3:1) came through and ravaged our lands! They captured 75 acres.'),
        pnLine('Forces from Scholar (3:2) came through and ravaged our lands! They looted 5,000 books.'),
    ].join('\n'));
    assert(d.attacks.length === 2, 'Attacks suffered: 2 entries');
    const acresAtk = d.attacks.find(a => a.kingdom === '3:1');
    const booksAtk = d.attacks.find(a => a.kingdom === '3:2');
    assert(acresAtk && acresAtk.acresCaptured === 75, 'Attacks suffered: acres captured = 75');
    assert(booksAtk && booksAtk.booksLooted === 5000, 'Attacks suffered: books looted = 5,000');
})();

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
if (failed > 0) process.exit(1);
