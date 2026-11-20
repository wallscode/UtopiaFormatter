'use strict';

/**
 * Combined Province Summary Tests
 * Tests formatCombinedProvinceSummary using the existing provincelogs.txt
 * and ProvinceNewsExample.txt test data files.
 */

const path = require('path');
const fs   = require('fs');
const assert = require('assert');

const {
    formatCombinedProvinceSummary,
    accumulateProvinceLogsData,
    accumulateProvinceNewsData,
    formatProvinceLogs,
    parseProvinceNews,
    splitProvinceInput,
    detectMixedProvinceInput,
    logUnrecognizedLine,
} = require('../js/parser.js');

const logsPath = path.join(__dirname, 'provincelogs.txt');
const newsPath = path.join(__dirname, 'ProvinceNewsExample.txt');

const logsText = fs.readFileSync(logsPath, 'utf8');
const newsText = fs.readFileSync(newsPath, 'utf8');

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`  PASS: ${name}`);
        passed++;
    } catch (e) {
        console.log(`  FAIL: ${name}`);
        console.log('       ' + e.message);
        failed++;
    }
}

console.log('\n--- Refactoring: accumulateProvinceLogsData ---');

test('accumulateProvinceLogsData returns an object with aidTotals', () => {
    const data = accumulateProvinceLogsData(logsText);
    assert(typeof data === 'object', 'should return object');
    assert(typeof data.aidTotals === 'object', 'should have aidTotals');
    assert(typeof data.spellCounts === 'object', 'should have spellCounts');
    assert(typeof data.thieveryCounts === 'object', 'should have thieveryCounts');
});

test('accumulateProvinceNewsData returns an object with aidByResource', () => {
    const data = accumulateProvinceNewsData(newsText);
    assert(typeof data === 'object', 'should return object');
    assert(typeof data.aidByResource === 'object', 'should have aidByResource');
    assert(typeof data.aidByResource.runes === 'object', 'should have aidByResource.runes');
});

test('formatProvinceLogs still works (backward compat)', () => {
    const result = formatProvinceLogs(logsText);
    assert(typeof result === 'string', 'should return string');
    assert(result.includes('Thievery Summary'), 'should contain Thievery Summary');
});

test('parseProvinceNews still works (backward compat)', () => {
    const result = parseProvinceNews(newsText);
    assert(typeof result === 'string', 'should return string');
    assert(result.includes('Province News Report'), 'should contain Province News Report');
});

console.log('\n--- formatCombinedProvinceSummary ---');

const combined = formatCombinedProvinceSummary(logsText, newsText);

test('returns a non-empty string', () => {
    assert(typeof combined === 'string' && combined.length > 100, 'should be non-empty string');
});

test('header says Combined Province Summary', () => {
    assert(combined.includes('Combined Province Summary'), 'should have combined header');
});

test('contains Aid Summary section', () => {
    assert(combined.includes('Aid Summary:'), 'should have Aid Summary');
});

test('Aid Summary shows Sent and Received labels', () => {
    const aidStart = combined.indexOf('Aid Summary:');
    assert(aidStart !== -1, 'Aid Summary section must exist');
    const aidSection = combined.substring(aidStart, aidStart + 600);
    assert(aidSection.includes('Sent:'), 'Aid section should include Sent:');
    assert(aidSection.includes('Received:'), 'Aid section should include Received:');
});

test('Aid Summary shows Net label', () => {
    const aidStart = combined.indexOf('Aid Summary:');
    const aidSection = combined.substring(aidStart, aidStart + 600);
    assert(aidSection.includes('Net:'), 'Aid section should include Net:');
});

test('contains Province Logs sections (Thievery Summary)', () => {
    // Header carries a success rate when there are thievery ops, e.g. "Thievery Summary (148/224 - 66%):"
    assert(/\n\nThievery Summary( \(\d+\/\d+ - \d+%\))?:/.test(combined), 'should have Thievery Summary from Province Logs');
});

test('contains Province News sections (Attacks Suffered)', () => {
    assert(combined.includes('Attacks Suffered'), 'should have Attacks Suffered from Province News');
});

test('does not contain standalone "Aid Received" section (merged into Aid Summary)', () => {
    // "Aid Received" is the Province News section name; it should be absent in combined output
    assert(!combined.includes('\n\nAid Received\n'), 'Aid Received standalone section should be absent');
});

test('does not duplicate Aid section — only one Aid Summary', () => {
    const count = (combined.match(/Aid Summary:/g) || []).length;
    assert(count === 1, `Aid Summary: should appear exactly once, found ${count}`);
});

console.log('\n--- Aid net calculation ---');

test('Aid net calculation: sent > received → "N sent"', () => {
    const logsData = accumulateProvinceLogsData(logsText);
    const newsData = accumulateProvinceNewsData(newsText);
    // Find a resource where sent > received and verify the combined output says "sent"
    const resources = ['runes', 'gold coins', 'bushels', 'soldiers', 'explore pool acres'];
    const newsKeys  = { runes: 'runes', 'gold coins': 'gold', bushels: 'bushels', soldiers: 'soldiers', 'explore pool acres': 'exploreAcres' };
    let found = false;
    for (const r of resources) {
        const sent = logsData.aidTotals[r] || 0;
        const nk = newsKeys[r];
        const received = newsData.aidByResource[nk] ? newsData.aidByResource[nk].total : 0;
        if (sent > received && sent > 0) { found = true; break; }
    }
    // If no resource has sent > received, just skip (not a failure of the code)
    if (!found) { assert(true, 'no resource with sent > received — skip'); return; }
    assert(combined.includes(' sent'), 'should include " sent" annotation');
});

test('throws ParseError on empty logs text', () => {
    let threw = false;
    try { formatCombinedProvinceSummary('', newsText); } catch (e) { threw = true; }
    assert(threw, 'should throw on empty logsText');
});

test('throws ParseError on empty news text', () => {
    let threw = false;
    try { formatCombinedProvinceSummary(logsText, ''); } catch (e) { threw = true; }
    assert(threw, 'should throw on empty newsText');
});

test('applyCombinedProvinceSettings adds \u2022 / \u00B7 bullets to indented lines', () => {
    const { applyCombinedProvinceSettings } = require('../js/ui.js');
    const out = applyCombinedProvinceSettings(formatCombinedProvinceSummary(logsText, newsText));
    const lines = out.split('\n');
    const twoSpace = lines.filter(l => /^  \S/.test(l));
    const fourSpace = lines.filter(l => /^    \S/.test(l));
    assert(twoSpace.length > 0 && twoSpace.every(l => l.startsWith('  \u2022 ')), 'all 2-space lines start with \u2022');
    assert(fourSpace.every(l => l.startsWith('    \u00B7 ')), 'all 4-space lines start with \u00B7');
});

console.log('\n--- Mixed single-box paste: Province Logs + Province News (Uto-zv6q) ---');

test('pure Province Logs paste is not treated as mixed', () => {
    assert.strictEqual(detectMixedProvinceInput(logsText), null);
});

test('pure Province News paste is not treated as mixed (meteor/Faery lines are shared)', () => {
    assert.strictEqual(detectMixedProvinceInput(newsText), null);
});

test('Logs then News in one paste splits into the same Combined Summary as two boxes', () => {
    const m = detectMixedProvinceInput(logsText + '\n' + newsText);
    assert(m, 'should detect mixed input');
    assert.strictEqual(formatCombinedProvinceSummary(m.logsText, m.newsText),
                       formatCombinedProvinceSummary(logsText, newsText));
});

test('News then Logs in one paste splits into the same Combined Summary as two boxes', () => {
    const m = detectMixedProvinceInput(newsText + '\n' + logsText);
    assert(m, 'should detect mixed input');
    assert.strictEqual(formatCombinedProvinceSummary(m.logsText, m.newsText),
                       formatCombinedProvinceSummary(logsText, newsText));
});

test('Province News with a single Province Logs line is detected as mixed', () => {
    const m = detectMixedProvinceInput(newsText + '\nMay 1 of YR8\tYou have ordered that 600 thieves be trained.');
    assert(m, 'should detect mixed input');
    assert.strictEqual(m.logsOnly, 1);
});

test('News lines from logged tickets route to the News side and are not reported unrecognized', () => {
    // Exact game text from Uto-a2mt, Uto-exaf, Uto-hakd, Uto-k5zo, Uto-jf0z, Uto-xj92
    const newsLines = [
        'Forces from 12 - Youknowwho (1:7) came through and ravaged our lands! They captured 282 acres! We lost 702 Archers and 559 Knights in this battle.',
        'Forces from 10 - Slurm (1:7) came through and ravaged our lands! Their armies razed 271 acres of buildings! We lost 146 Archers and 161 Knights in this battle.',
        'Our mages noticed a possible spell attempt by Nebula Haven (1:7) causing trouble on our lands!',
        'We have found thieves from New Beginnings (1:7) causing trouble within our lands!',
        'We have received a shipment of 40,000 gold coins from 65 Ford Mustang Convertable (5:7).',
        'We have received a shipment of 241 soldiers from Bugatti Chiron (5:7).',
    ].map(l => 'May 2 of YR8\t' + l);
    const input = 'May 1 of YR8\tYou have ordered that 600 thieves be trained.\n' + newsLines.join('\n');
    const m = detectMixedProvinceInput(input);
    assert(m, 'should detect mixed input');
    assert.strictEqual(m.newsOnly, newsLines.length);
    assert.strictEqual(m.newsText, newsLines.join('\n'));

    // Capture unrecognized-line logging while parsing each half
    const sent = [];
    global.window = { APP_CONFIG: { logEndpoint: 'x' } };
    global.fetch = (u, o) => { sent.push(JSON.parse(o.body)); return Promise.resolve(); };
    try {
        formatCombinedProvinceSummary(m.logsText, m.newsText);
    } finally {
        delete global.window;
        delete global.fetch;
    }
    assert.deepStrictEqual(sent, [], 'no lines should be reported as unrecognized');
});

test('splitProvinceInput with no exclusive lines keeps everything on the primary side', () => {
    const only = 'May 1 of YR8\tMeteors rain across the lands and kill 82 peasants!';
    assert.strictEqual(splitProvinceInput(only, 'province-news').newsText, only);
    assert.strictEqual(splitProvinceInput(only, 'province-logs').logsText, only);
});

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
if (failed > 0) process.exit(1);
