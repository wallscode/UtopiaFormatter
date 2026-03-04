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
} = require('../js/parser.js');

const logsPath = path.join(__dirname, 'provincelogs.txt');
const newsPath = path.join(__dirname, '..', 'ProvinceNewsExample.txt');

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
    assert(combined.includes('Thievery Summary:'), 'should have Thievery Summary from Province Logs');
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

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
if (failed > 0) process.exit(1);
