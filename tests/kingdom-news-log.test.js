/**
 * Kingdom News Log Parser Test Suite
 * Tests the full Kingdom News log parsing functionality and validates exact format matching
 */

const fs = require('fs');
const path = require('path');

// Import parser functions
const parser = require('../js/parser.js');

// Read test files
const originalText = fs.readFileSync(
    path.join(__dirname, 'Kingdom News original.txt'), 
    'utf8'
);
const expectedText = fs.readFileSync(
    path.join(__dirname, 'Kingdom News Report target format.txt'), 
    'utf8'
);

console.log('=== KINGDOM NEWS LOG PARSER TEST SUITE ===\n');

console.log('📁 Loading test files...');
console.log(`✅ Input file: Kingdom News original.txt (${originalText.length} chars)`);
console.log(`✅ Expected file: Kingdom News Report target format.txt (${expectedText.length} chars)`);

// Test 1: Exact format validation
console.log('\n🧪 Test 1: Exact format validation...');
try {
    const startTime = Date.now();
    const result = parser.parseKingdomNewsLog(originalText);
    const endTime = Date.now();
    
    console.log(`⏱️  Parsing completed in ${endTime - startTime}ms`);
    console.log(`📊 Result length: ${result.length} characters`);
    
    // Normalize line endings for comparison
    const normalizeLineEndings = (text) => text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
    
    const normalizedResult = normalizeLineEndings(result);
    const normalizedExpected = normalizeLineEndings(expectedText);
    
    if (normalizedResult === normalizedExpected) {
        console.log('🎉 SUCCESS: Output matches expected format EXACTLY!');
        console.log('✅ All formatting, spacing, and content is correct');
    } else {
        console.log('❌ FAILURE: Output does not match expected format');
        
        const resultLines = normalizedResult.split('\n');
        const expectedLines = normalizedExpected.split('\n');
        
        console.log(`\n📊 Format Analysis:`);
        console.log(`   Result lines: ${resultLines.length}`);
        console.log(`   Expected lines: ${expectedLines.length}`);
        
        // Find first difference
        let firstDiff = -1;
        const maxLines = Math.max(resultLines.length, expectedLines.length);
        
        for (let i = 0; i < maxLines; i++) {
            if (resultLines[i] !== expectedLines[i]) {
                firstDiff = i;
                break;
            }
        }
        
        if (firstDiff >= 0) {
            console.log(`\n📍 First difference at line ${firstDiff + 1}:`);
            console.log(`   Expected: "${expectedLines[firstDiff] || '[END OF FILE]'}"`);
            console.log(`   Got:      "${resultLines[firstDiff] || '[END OF FILE]'}"`);
        }
        
        // Check key metrics
        const resultAttackMade = resultLines.find(line => line.includes('Total Attacks Made:'));
        const expectedAttackMade = expectedLines.find(line => line.includes('Total Attacks Made:'));
        
        if (resultAttackMade && expectedAttackMade) {
            const resultMatch = resultAttackMade.match(/Total Attacks Made: (\d+) \((\d+) acres\)/);
            const expectedMatch = expectedAttackMade.match(/Total Attacks Made: (\d+) \((\d+) acres\)/);
            
            if (resultMatch && expectedMatch) {
                console.log(`\n📈 Key Metrics Comparison:`);
                console.log(`   Attack count: ${resultMatch[1]} vs ${expectedMatch[1]} ${resultMatch[1] === expectedMatch[1] ? '✅' : '❌'}`);
                console.log(`   Acres count: ${resultMatch[2]} vs ${expectedMatch[2]} ${resultMatch[2] === expectedMatch[2] ? '✅' : '❌'}`);
            }
        }
    }
    
} catch (error) {
    console.log('❌ Test 1 failed with error:', error.message);
}

// Test 2: Function availability
console.log('\n🧪 Test 2: Function availability...');
try {
    const result = parser.parseKingdomNewsLog(originalText);
    
    console.log(`✅ Function availability test - PASSED`);
    console.log(`   Result length: ${result.length} characters`);
    console.log(`   Function is callable and returns a string`);
    
} catch (error) {
    console.log(`❌ Function availability test - ERROR: ${error.message}`);
}

// Test 3: Minimal input
console.log('\n🧪 Test 3: Minimal input...');
try {
    const minimalInput = 'February 1 of YR0\t15 - Test Province (5:1) captured 10 acres of land from 20 - Target (4:1).';
    const minimalResult = parser.parseKingdomNewsLog(minimalInput);
    
    console.log(`✅ Minimal input test - PASSED`);
    console.log(`   Result length: ${minimalResult.length} characters`);
    console.log(`   Function handles minimal input correctly`);
    
} catch (error) {
    console.log(`❌ Minimal input test - ERROR: ${error.message}`);
}

// Test 4: Empty input
console.log('\n🧪 Test 4: Empty input...');
try {
    parser.parseKingdomNewsLog('');
    console.log(`❌ Empty input test - FAILED: Should have thrown an error`);
} catch (error) {
    console.log(`✅ Empty input test - PASSED: Correctly threw error: ${error.message}`);
}

// Test 5: No date line
console.log('\n🧪 Test 5: No date line...');
try {
    parser.parseKingdomNewsLog('Some random text without a date line');
    console.log(`❌ No date line test - FAILED: Should have thrown an error`);
} catch (error) {
    console.log(`✅ No date line test - PASSED: Correctly threw error: ${error.message}`);
}

// ─── Shared test helpers ─────────────────────────────────────────────────────

function makeAssert() {
    let passed = 0, failed = 0;
    function assert(desc, got, expected) {
        if (got === expected) {
            passed++;
        } else {
            failed++;
            console.log(`  ❌ ${desc}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}`);
        }
    }
    return { assert, summary: () => ({ passed, failed }) };
}

// Parse a province section (** Own Kingdom X ** or ** The Kingdom of Y **)
// Returns { 'Province Name': { made, suffered }, ... }
function parseProvinceSection(lines, header) {
    const start = lines.findIndex(l => l === header);
    if (start === -1) return null;
    const provinces = {};
    for (let i = start + 2; i < lines.length; i++) {
        if (lines[i] === '') break;
        const m = lines[i].match(/^\s*-?\d+\s*\|\s*(.+?)\s*\((\d+)\/(\d+)\)$/);
        if (!m) break;
        provinces[m[1]] = { made: parseInt(m[2]), suffered: parseInt(m[3]) };
    }
    return provinces;
}

// Parse kingdom totals from the "Total land exchanged: X (made/suffered)" line
function parseKingdomTotal(lines, header) {
    const start = lines.findIndex(l => l === header);
    if (start === -1) return null;
    const m = lines[start + 1].match(/\((\d+)\/(\d+)\)/);
    return m ? { made: parseInt(m[1]), suffered: parseInt(m[2]) } : null;
}

// Parse a ** Uniques for X ** section into { 'Province Name': count }
function parseUniquesSection(lines, header) {
    const start = lines.findIndex(l => l === header);
    if (start === -1) return null;
    const uniques = {};
    for (let i = start + 1; i < lines.length; i++) {
        if (lines[i] === '') break;
        const m = lines[i].match(/^(.+?)\s+(\d+)$/);
        if (m) uniques[m[1]] = parseInt(m[2]);
    }
    return uniques;
}

// ─── Test 6: Per-province attack counts (Uto-9iis) ───────────────────────────
console.log('\n🧪 Test 6: Per-province attack counts...');
try {
    const result = parser.parseKingdomNewsLog(originalText);
    const lines = result.split('\n');
    const { assert, summary } = makeAssert();

    // Own kingdom totals
    const ownTotal = parseKingdomTotal(lines, '** Own Kingdom 5:1 **');
    assert('5:1 total made',    ownTotal?.made,     279);
    assert('5:1 total suffered', ownTotal?.suffered, 196);

    // Own kingdom per-province counts
    const own = parseProvinceSection(lines, '** Own Kingdom 5:1 **');
    assert('7 - Slow Attack times made',       own?.['7 - Slow Attack times']?.made,       19);
    assert('7 - Slow Attack times suffered',   own?.['7 - Slow Attack times']?.suffered,   11);
    assert('12 - Misstress Of Time made',      own?.['12 - Misstress Of Time']?.made,      15);
    assert('12 - Misstress Of Time suffered',  own?.['12 - Misstress Of Time']?.suffered,  12);
    assert('18 - Sushi Sampo Time made',       own?.['18 - Sushi Sampo Time']?.made,       19);
    assert('18 - Sushi Sampo Time suffered',   own?.['18 - Sushi Sampo Time']?.suffered,   39);
    assert('10 - Timeless Rock Band made',     own?.['10 - Timeless Rock Band']?.made,     20);
    assert('10 - Timeless Rock Band suffered', own?.['10 - Timeless Rock Band']?.suffered, 10);
    assert('13 - Time made',                   own?.['13 - Time']?.made,                    2);
    assert('13 - Time suffered',               own?.['13 - Time']?.suffered,                3);

    // 4:1 kingdom totals
    const k41Total = parseKingdomTotal(lines, '** The Kingdom of 4:1 **');
    assert('4:1 total made',     k41Total?.made,     193);
    assert('4:1 total suffered', k41Total?.suffered, 279);

    // 4:1 per-province counts
    const k41 = parseProvinceSection(lines, '** The Kingdom of 4:1 **');
    assert('19 - Alchemaria made',     k41?.['19 - Alchemaria']?.made,       10);
    assert('19 - Alchemaria suffered', k41?.['19 - Alchemaria']?.suffered,   16);
    assert('10 - Longtimeago made',    k41?.['10 - Longtimeago']?.made,      14);
    assert('10 - Longtimeago suffered',k41?.['10 - Longtimeago']?.suffered,  11);
    assert('22 - Thor made',           k41?.['22 - Thor']?.made,             10);
    assert('22 - Thor suffered',       k41?.['22 - Thor']?.suffered,         34);
    assert('20 - Fist made',           k41?.['20 - Fist']?.made,              0);
    assert('20 - Fist suffered',       k41?.['20 - Fist']?.suffered,          6);
    assert('1 - Holo Wolf made',       k41?.['1 - Holo Wolf']?.made,          0);
    assert('1 - Holo Wolf suffered',   k41?.['1 - Holo Wolf']?.suffered,      4);

    // Unknown province present with correct counts
    assert('An unknown province made',     k41?.['An unknown province']?.made,     1);
    assert('An unknown province suffered', k41?.['An unknown province']?.suffered, 0);

    // Unknown province must NOT appear in Uniques for 4:1
    const uniqStart = lines.findIndex(l => l === '** Uniques for 4:1 **');
    let foundUnknown = false;
    for (let i = uniqStart + 1; i < lines.length; i++) {
        if (lines[i] === '') break;
        if (lines[i].includes('An unknown province')) { foundUnknown = true; break; }
    }
    assert('An unknown province excluded from uniques', foundUnknown, false);

    // 6:1 kingdom totals
    const k61Total = parseKingdomTotal(lines, '** The Kingdom of 6:1 **');
    assert('6:1 total made',     k61Total?.made,     3);
    assert('6:1 total suffered', k61Total?.suffered, 0);

    const { passed, failed } = summary();
    console.log(`${failed === 0 ? '✅' : '❌'} Per-province attack counts — ${passed} passed, ${failed} failed`);
} catch (error) {
    console.log('❌ Test 6 failed with error:', error.message);
}

// ─── Test 7: calculateUniques unit tests (Uto-9022) ──────────────────────────
console.log('\n🧪 Test 7: calculateUniques unit tests...');
try {
    const { calculateUniques, dateToNumber, UNIQUE_WINDOW_DAYS } = parser;
    const { assert, summary } = makeAssert();

    assert('UNIQUE_WINDOW_DAYS is 6', UNIQUE_WINDOW_DAYS, 6);

    const d = dateToNumber('February 1 of YR0'); // baseline date value

    // Same-day attacks count as 1 unique
    assert('same-day: 2 attacks → 1 unique',
        calculateUniques([{ dateVal: d, attackerKey: 'A' }, { dateVal: d, attackerKey: 'A' }], UNIQUE_WINDOW_DAYS).total, 1);

    // Attacks exactly 6 days apart are in the same window (within window)
    assert('6 days apart → 1 unique',
        calculateUniques([{ dateVal: d, attackerKey: 'A' }, { dateVal: d + 6, attackerKey: 'A' }], UNIQUE_WINDOW_DAYS).total, 1);

    // Attacks exactly 7 days apart start a new window
    assert('7 days apart → 2 uniques',
        calculateUniques([{ dateVal: d, attackerKey: 'A' }, { dateVal: d + 7, attackerKey: 'A' }], UNIQUE_WINDOW_DAYS).total, 2);

    // Three attacks: first two in window 1, third starts window 2
    assert('0+3+7 days → 2 uniques',
        calculateUniques([
            { dateVal: d,     attackerKey: 'A' },
            { dateVal: d + 3, attackerKey: 'A' },
            { dateVal: d + 7, attackerKey: 'A' }
        ], UNIQUE_WINDOW_DAYS).total, 2);

    // Attacks spanning three windows
    assert('multiple windows (0,6,7,14) → 3 uniques',
        calculateUniques([
            { dateVal: d,      attackerKey: 'A' },
            { dateVal: d + 6,  attackerKey: 'A' }, // same window
            { dateVal: d + 7,  attackerKey: 'A' }, // window 2
            { dateVal: d + 14, attackerKey: 'A' }, // window 3 (7 days after d+7)
        ], UNIQUE_WINDOW_DAYS).total, 3);

    // Two attackers are counted independently
    assert('two attackers counted separately',
        calculateUniques([
            { dateVal: d,     attackerKey: 'A' },
            { dateVal: d + 7, attackerKey: 'A' }, // A: 2 uniques
            { dateVal: d,     attackerKey: 'B' }, // B: 1 unique → total 3
        ], UNIQUE_WINDOW_DAYS).total, 3);

    // perAttacker breakdown is correct
    const r = calculateUniques([
        { dateVal: d,     attackerKey: 'X' },
        { dateVal: d + 6, attackerKey: 'X' },
        { dateVal: d + 7, attackerKey: 'X' },
        { dateVal: d,     attackerKey: 'Y' },
    ], UNIQUE_WINDOW_DAYS);
    assert('perAttacker X = 2', r.perAttacker['X'], 2);
    assert('perAttacker Y = 1', r.perAttacker['Y'], 1);

    const { passed, failed } = summary();
    console.log(`${failed === 0 ? '✅' : '❌'} calculateUniques unit tests — ${passed} passed, ${failed} failed`);
} catch (error) {
    console.log('❌ Test 7 failed with error:', error.message);
}

// ─── Test 8: Per-province unique counts integration (Uto-9022) ───────────────
console.log('\n🧪 Test 8: Per-province unique counts...');
try {
    const result = parser.parseKingdomNewsLog(originalText);
    const lines = result.split('\n');
    const { assert, summary } = makeAssert();

    // Summary totals (first -- Uniques: is made, second is suffered)
    const uniqSummaryLines = lines.filter(l => /^-- Uniques: \d+/.test(l));
    assert('made uniques total',     parseInt(uniqSummaryLines[0]?.match(/(\d+)/)?.[1]), 105);
    assert('suffered uniques total', parseInt(uniqSummaryLines[1]?.match(/(\d+)/)?.[1]),  82);

    // Per-province made uniques (5:1 attacking 4:1)
    const made = parseUniquesSection(lines, '** Uniques for 5:1 **');
    assert('12 - Misstress Of Time uniques', made?.['12 - Misstress Of Time'], 6);
    assert('3 - RazorclawTime uniques',      made?.['3 - RazorclawTime'],      6);
    assert('7 - Slow Attack times uniques',  made?.['7 - Slow Attack times'],  6);
    assert('17 - Pee Time uniques',          made?.['17 - Pee Time'],          5);
    assert('15 - Father time uniques',       made?.['15 - Father time'],       5);
    assert('21 - ticking time uniques',      made?.['21 - ticking time'],      3);
    assert('13 - Time uniques',              made?.['13 - Time'],              2);

    // Per-province suffered uniques (4:1 attacking 5:1)
    const suffered = parseUniquesSection(lines, '** Uniques for 4:1 **');
    assert('23 - Blitzwaaagh uniques',   suffered?.['23 - Blitzwaaagh'],   5);
    assert('4 - Legion ROC uniques',     suffered?.['4 - Legion ROC'],     5);
    assert('10 - Longtimeago uniques',   suffered?.['10 - Longtimeago'],   4); // W=6: 14 attacks → 4 windows
    assert('19 - Alchemaria uniques',    suffered?.['19 - Alchemaria'],    4); // W=6: 10 attacks → 4 windows
    assert('12 - Pong uniques',          suffered?.['12 - Pong'],          3);
    assert('22 - Thor uniques',          suffered?.['22 - Thor'],          3);

    // 6:1 suffered uniques
    const suffered6 = parseUniquesSection(lines, '** Uniques for 6:1 **');
    assert('20 - LEEROY JENKINS uniques',      suffered6?.['20 - LEEROY JENKINS'],      1);
    assert('6 - THAT IS NOT MY COW uniques',   suffered6?.['6 - THAT IS NOT MY COW'],   1);

    const { passed, failed } = summary();
    console.log(`${failed === 0 ? '✅' : '❌'} Per-province unique counts — ${passed} passed, ${failed} failed`);
} catch (error) {
    console.log('❌ Test 8 failed with error:', error.message);
}

console.log('\n=== KINGDOM NEWS LOG TESTS COMPLETE ===\n');
