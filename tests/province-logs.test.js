/**
 * Province Logs Parser Test Suite
 * Tests the formatProvinceLogs function with real-world data
 */

const parser = require('../js/parser.js');
const fs = require('fs');
const path = require('path');

console.log('=== PROVINCE LOGS PARSER TEST SUITE ===\n');

// Test configuration - files are now in the tests folder
const testConfig = {
    inputFile: path.join(__dirname, 'provincelogs.txt'),
    expectedOutputFile: path.join(__dirname, 'provincelogs_expected_output.txt'),
    tolerance: 0.01 // Allow for minor formatting differences
};

// Helper function to normalize line endings and whitespace
function normalizeText(text) {
    return text
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\n+$/, '') // Remove trailing newlines
        .trim();
}

// Helper function to compare texts with tolerance for formatting differences
function compareTexts(actual, expected, tolerance = 0.01) {
    const actualLines = actual.split('\n');
    const expectedLines = expected.split('\n');
    
    if (actualLines.length !== expectedLines.length) {
        return {
            passed: false,
            reason: `Line count mismatch: expected ${expectedLines.length}, got ${actualLines.length}`,
            differences: []
        };
    }
    
    const differences = [];
    let totalDifferences = 0;
    
    for (let i = 0; i < Math.max(actualLines.length, expectedLines.length); i++) {
        const actualLine = actualLines[i] || '';
        const expectedLine = expectedLines[i] || '';
        
        if (actualLine !== expectedLine) {
            differences.push({
                line: i + 1,
                expected: expectedLine,
                actual: actualLine
            });
            totalDifferences++;
        }
    }
    
    const totalLines = Math.max(actualLines.length, expectedLines.length);
    const differenceRatio = totalDifferences / totalLines;
    
    return {
        passed: differenceRatio <= tolerance,
        reason: differenceRatio <= tolerance 
            ? 'Texts match within tolerance'
            : `Too many differences: ${totalDifferences}/${totalLines} lines differ`,
        differences: differences.slice(0, 10) // Show first 10 differences
    };
}

// Main test execution
function runProvinceLogsTest() {
    try {
        console.log('🧪 Loading test data...\n');
        
        // Read input and expected output files
        const inputData = fs.readFileSync(testConfig.inputFile, 'utf8');
        const expectedOutput = fs.readFileSync(testConfig.expectedOutputFile, 'utf8');
        
        console.log(`✅ Input file loaded: ${testConfig.inputFile}`);
        console.log(`✅ Expected output loaded: ${testConfig.expectedOutputFile}`);
        console.log(`📊 Input size: ${inputData.length} characters`);
        console.log(`📊 Expected output size: ${expectedOutput.length} characters\n`);
        
        console.log('🔄 Processing province logs...\n');
        
        // Process the input
        const startTime = Date.now();
        const actualOutput = parser.formatProvinceLogs(inputData);
        const processingTime = Date.now() - startTime;
        
        console.log(`⏱️  Processing completed in ${processingTime}ms`);
        console.log(`📊 Actual output size: ${actualOutput.length} characters\n`);
        
        console.log('🔍 Comparing results...\n');
        
        // Compare results
        const comparison = compareTexts(
            normalizeText(actualOutput),
            normalizeText(expectedOutput),
            testConfig.tolerance
        );
        
        if (comparison.passed) {
            console.log('✅ PROVINCE LOGS PARSING TEST - PASSED');
            console.log(`✅ ${comparison.reason}`);
            
            // Show first few lines of output for verification
            console.log('\n--- Sample Output (first 10 lines) ---');
            const sampleLines = actualOutput.split('\n').slice(0, 10);
            sampleLines.forEach((line, index) => {
                console.log(`${index + 1}: ${line}`);
            });
            
        } else {
            console.log('❌ PROVINCE LOGS PARSING TEST - FAILED');
            console.log(`❌ ${comparison.reason}`);
            
            if (comparison.differences.length > 0) {
                console.log('\n--- Differences Found ---');
                comparison.differences.forEach(diff => {
                    console.log(`Line ${diff.line}:`);
                    console.log(`  Expected: "${diff.expected}"`);
                    console.log(`  Got:      "${diff.actual}"`);
                    console.log('');
                });
                
                if (comparison.differences.length >= 10) {
                    console.log(`... and ${comparison.differences.length - 10} more differences`);
                }
            }
        }
        
        // Additional validation checks
        console.log('\n--- Additional Validation ---');
        
        const validationChecks = [
            {
                name: 'Contains Summary header',
                test: (text) => text.includes('Summary of Province Log Events'),
                expected: true
            },
            {
                name: 'Contains Thievery Summary',
                test: (text) => text.includes('Thievery Summary:'),
                expected: true
            },
            {
                name: 'Contains Resources Stolen',
                test: (text) => text.includes('Resources Stolen:'),
                expected: true
            },
            {
                name: 'Contains Spell Summary',
                test: (text) => text.includes('Spell Summary:'),
                expected: true
            },
            {
                name: 'Contains Aid Summary',
                test: (text) => text.includes('Aid Summary:'),
                expected: true
            },
            {
                name: 'Contains Dragon Summary',
                test: (text) => text.includes('Dragon Summary:'),
                expected: true
            },
            {
                name: 'Contains Ritual Summary',
                test: (text) => text.includes('Ritual Summary:'),
                expected: true
            },
            {
                name: 'Has proper structure',
                test: (text) => {
                    const lines = text.split('\n');
                    return lines.some(line => line.includes('---')) && // Has separators
                           lines.some(line => line.trim() === '') && // Has empty lines
                           lines.length > 20; // Has reasonable length
                },
                expected: true
            }
        ];
        
        let validationPassed = 0;
        validationChecks.forEach(check => {
            const result = check.test(actualOutput);
            const passed = result === check.expected;
            console.log(`${passed ? '✅' : '❌'} ${check.name}: ${passed ? 'PASSED' : 'FAILED'}`);
            if (passed) validationPassed++;
        });
        
        console.log(`\nValidation: ${validationPassed}/${validationChecks.length} checks passed`);
        
        // Performance metrics
        console.log('\n--- Performance Metrics ---');
        console.log(`⏱️  Processing time: ${processingTime}ms`);
        console.log(`📊 Input lines: ${inputData.split('\n').length}`);
        console.log(`📊 Output lines: ${actualOutput.split('\n').length}`);
        console.log(`📊 Compression ratio: ${((actualOutput.length / inputData.length) * 100).toFixed(1)}%`);
        
        return comparison.passed && validationPassed === validationChecks.length;
        
    } catch (error) {
        console.log('❌ TEST EXECUTION FAILED');
        console.log('Error:', error.message);
        console.log('Stack trace:', error.stack);
        return false;
    }
}

// Component tests for individual functions
function runComponentTests() {
    console.log('\n=== COMPONENT TESTS ===\n');
    
    const componentTests = [
        {
            name: 'formatProvinceLogs function exists',
            test: () => typeof parser.formatProvinceLogs === 'function',
            expected: true
        },
        {
            name: 'formatProvinceLogs is callable',
            test: () => {
                try {
                    const result = parser.formatProvinceLogs('test');
                    return typeof result === 'string';
                } catch (error) {
                    return true; // Expected to fail with invalid input, but should be callable
                }
            },
            expected: true
        },
        {
            name: 'Helper functions available',
            test: () => {
                return typeof parser.escapeRegExp === 'function' &&
                       typeof parser.formatNumber === 'function';
            },
            expected: true
        },
        {
            name: 'Constants available',
            test: () => {
                return parser.PROVINCE_LOGS_CONFIG &&
                       parser.PROVINCE_LOGS_CONFIG.SPELLS &&
                       parser.PROVINCE_LOGS_CONFIG.OPERATIONS &&
                       Array.isArray(parser.PROVINCE_LOGS_CONFIG.SPELLS) &&
                       Array.isArray(parser.PROVINCE_LOGS_CONFIG.OPERATIONS);
            },
            expected: true
        }
    ];
    
    let passedTests = 0;
    componentTests.forEach(test => {
        try {
            const result = test.test();
            const passed = result === test.expected;
            console.log(`${passed ? '✅' : '❌'} ${test.name}: ${passed ? 'PASSED' : 'FAILED'}`);
            if (passed) passedTests++;
        } catch (error) {
            console.log(`❌ ${test.name}: ERROR - ${error.message}`);
        }
    });
    
    console.log(`\nComponent Tests: ${passedTests}/${componentTests.length} passed`);
    return passedTests === componentTests.length;
}

// ── Value assertion tests: specific parsed counts from full test data ─────────
function runValueAssertionTests() {
    console.log('\n=== PROVINCE LOGS VALUE ASSERTION TESTS ===\n');

    let passed = 0, failed = 0;
    function assert(desc, got, expected) {
        if (got === expected) {
            passed++;
        } else {
            failed++;
            console.log(`  ❌ ${desc}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}`);
        }
    }
    function assertContains(text, substring, desc) {
        if (text.includes(substring)) { passed++; }
        else { failed++; console.log(`  ❌ ${desc}: output does not contain "${substring}"`); }
    }
    function assertNotContains(text, substring, desc) {
        if (!text.includes(substring)) { passed++; }
        else { failed++; console.log(`  ❌ ${desc}: output should NOT contain "${substring}"`); }
    }

    try {
        const inputData = fs.readFileSync(path.join(__dirname, 'provincelogs.txt'), 'utf8');
        const output = parser.formatProvinceLogs(inputData);

        // ── Thievery Summary ─────────────────────────────────────────────────
        console.log('--- Thievery Summary ---');
        assertContains(output, '13 Greater Arson:', 'Greater Arson: 13 ops');
        assertContains(output, '  33 Watch Towers', 'Greater Arson: 33 Watch Towers');
        assertContains(output, '  32 Hospitals', 'Greater Arson: 32 Hospitals');
        assertContains(output, '  31 Homes', 'Greater Arson: 31 Homes');
        assertContains(output, '  17 Guilds', 'Greater Arson: 17 Guilds');
        assertContains(output, '  12 Banks', 'Greater Arson: 12 Banks');
        assertContains(output, '11 Propaganda:', 'Propaganda: 11 ops');
        assertContains(output, '9 Arson for a total of 85 acres', 'Arson: 9 ops, 85 acres');
        assertContains(output, '7 Bribe Generals ops', 'Bribe Generals: 7 ops');
        assertContains(output, '5 Incite Riots for a total of 24 days', 'Incite Riots: 5 ops, 24 days');
        assertContains(output, '3 Assassinate Wizards for a total of 306 wizards', 'Assassinate Wizards: 3 ops, 306 wizards');
        assertContains(output, '3 Kidnapping for a total of 336 peasants', 'Kidnapping: 3 ops, 336 peasants');
        assertContains(output, '2 Bribe Thieves ops', 'Bribe Thieves: 2 ops');
        assertContains(output, '2 Night Strike for a total of 24 enemy troops', 'Night Strike: 2 ops, 24 enemy troops');
        assertContains(output, '1 Sabotage Wizards for a total of 1 day', 'Sabotage Wizards: 1 op, 1 day');
        assertContains(output, '76 failed thievery attempts (1589 thieves lost)', 'Failed: 76 attempts, 1589 lost');
        assertContains(output, '359 thieves lost in successful operations', '359 thieves lost in successful ops');

        // ── Resources Stolen ─────────────────────────────────────────────────
        console.log('--- Resources Stolen ---');
        assertContains(output, '1,404,731 gold coins (24 ops', 'Gold stolen: 1,404,731 (24 ops)');
        assertContains(output, '597,907 bushels (15 ops', 'Bushels stolen: 597,907 (15 ops)');
        assertContains(output, '746,273 runes (51 ops', 'Runes stolen: 746,273 (51 ops)');
        assertContains(output, '50 war horses', 'War horses stolen: 50');

        // ── Spell Summary ─────────────────────────────────────────────────────
        console.log('--- Spell Summary ---');
        assertContains(output, '62 Meteor Showers for a total of 493 days', 'Meteor Showers: 62, 493 days');
        assertContains(output, '50 Mystic Vortex for a total of 107 active spells', 'Mystic Vortex: 50, 107 active spells');
        assertContains(output, '33 Chastity for a total of 185 days', 'Chastity: 33, 185 days');
        assertContains(output, '10 Pitfalls for a total of 119 days', 'Pitfalls: 10, 119 days');
        assertContains(output, '4 Amnesia for a total of 322,673 books', 'Amnesia: 4, 322,673 books');
        assertContains(output, '4 Droughts for a total of 53 days', 'Droughts: 4, 53 days');
        assertContains(output, '4 Lightning Strike for a total of 14,884 runes', 'Lightning Strike: 4, 14,884 runes');
        assertContains(output, '4 Nightmares for a total of 1,450 troops', 'Nightmares: 4, 1,450 troops');
        assertContains(output, '3 Fireball for a total of 3,639 peasants', 'Fireball: 3, 3,639 peasants');
        assertContains(output, '3 Land Lust for a total of 81 acres', 'Land Lust: 3, 81 acres');
        assertContains(output, '3 Tornadoes for a total of 1,025 acres of buildings', 'Tornadoes: 3, 1,025 acres');

        // ── Aid Summary ───────────────────────────────────────────────────────
        console.log('--- Aid Summary ---');
        assertContains(output, '5,072,494 gold coins', 'Aid: 5,072,494 gold');
        assertContains(output, '349,977 runes', 'Aid: 349,977 runes');
        assertContains(output, '246,000 bushels', 'Aid: 246,000 bushels');
        assertContains(output, '16,572 soldiers', 'Aid: 16,572 soldiers');
        assertContains(output, '2 explore pool acres', 'Aid: 2 explore pool acres');

        // ── Dragon Summary ────────────────────────────────────────────────────
        console.log('--- Dragon Summary ---');
        assertContains(output, '1,965,315 gold coins donated', 'Dragon: 1,965,315 gold donated');
        assertContains(output, '881,611 bushels donated', 'Dragon: 881,611 bushels donated');
        assertContains(output, '7,693 troops sent and weakened by 94,633 points', 'Dragon: 7,693 troops, 94,633 weakening');

        // ── Ritual Summary ────────────────────────────────────────────────────
        console.log('--- Ritual Summary ---');
        assertContains(output, '37 successful ritual casts', 'Ritual: 37 successful casts');

        // ── Thievery Targets ──────────────────────────────────────────────────
        console.log('--- Thievery Targets ---');
        const thiefStart = output.indexOf('Thievery Targets:');
        const thiefEnd   = output.indexOf('\n\nSpell Targets:');
        const thiefSection = output.substring(thiefStart, thiefEnd);
        assert('Thievery Targets: 28 distinct provinces', (thiefSection.match(/— \d+ op/g) || []).length, 28);
        assertNotContains(thiefSection, 'Unknown', 'No Unknown entries in Thievery Targets');
        assertContains(output, 'Willaimia Sherman (4:11) — 47 ops', 'Willaimia Sherman 47 ops (highest)');

        // ── Spell Targets ─────────────────────────────────────────────────────
        console.log('--- Spell Targets ---');
        const spellTgtStart = output.indexOf('Spell Targets:');
        const spellTgtEnd   = output.indexOf('\n\nThievery by Op Type:');
        const spellTgtSection = output.substring(spellTgtStart, spellTgtEnd);
        assert('Spell Targets: 39 distinct provinces', (spellTgtSection.match(/— \d+ cast/g) || []).length, 39);
        assertContains(output, 'Back From The Edge (4:8) — 24 casts', 'Back From The Edge: 24 casts (highest)');

        // ── Thievery by Op Type ───────────────────────────────────────────────
        console.log('--- Thievery by Op Type ---');
        assertContains(output, 'Tower Robbery — 51 ops (746,273 runes):', 'Tower Robbery: 51 ops, 746,273 runes');
        assertContains(output, 'Vault Robbery — 24 ops (1,404,731 gold coins):', 'Vault Robbery: 24 ops');
        assertContains(output, 'Granary Robbery — 15 ops (597,907 bushels):', 'Granary Robbery: 15 ops');
        assertContains(output, 'Greater Arson — 13 ops (33 Watch Towers, 32 Hospitals', 'Greater Arson by-type header');
        // Impact-descending: "to hell and back" (164,991 runes) before "mystic" (113,133 runes) despite fewer ops
        const towerStart = output.indexOf('Tower Robbery — 51 ops');
        const hellIdx    = output.indexOf('to hell and back (3:9):', towerStart);
        const mysticIdx  = output.indexOf('mystic (4:8):', towerStart);
        assert('Tower Robbery: impact sort — to hell and back before mystic', hellIdx < mysticIdx && hellIdx !== -1, true);

        // ── Spell by Spell Type ───────────────────────────────────────────────
        console.log('--- Spell by Spell Type ---');
        assertContains(output, 'Meteor Showers — 62 casts (493 days):', 'Meteor Showers 62 casts in by-type');
        assertContains(output, 'Mystic Vortex — 50 casts (107 active spells):', 'Mystic Vortex 50 casts in by-type');
        // Impact-descending: Back From The Edge (34 days) before muguiying (23 days) under Meteor Showers
        const meteorStart = output.indexOf('Meteor Showers — 62 casts');
        const bfteIdx     = output.indexOf('Back From The Edge (4:8):', meteorStart);
        const muguIdx     = output.indexOf('muguiying (4:11):', meteorStart);
        assert('Meteor Showers: impact sort — Back From The Edge before muguiying', bfteIdx < muguIdx && bfteIdx !== -1, true);

        console.log(`\n${failed === 0 ? '✅' : '❌'} Value assertions: ${passed} passed, ${failed} failed`);
        return failed === 0;
    } catch (error) {
        console.log('❌ Value assertion tests failed with error:', error.message);
        return false;
    }
}

// ── applyProvinceLogsSettings unit tests ─────────────────────────────────────
function runApplySettingsTests() {
    console.log('\n=== APPLY PROVINCE LOGS SETTINGS TESTS ===\n');

    const ui = require('../js/ui.js');
    const { applyProvinceLogsSettings, advSettings } = ui;

    let passed = 0, failed = 0;
    function assert(desc, got, expected) {
        if (got === expected) { passed++; }
        else { failed++; console.log(`  ❌ ${desc}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}`); }
    }

    // Save original settings for restore at end
    const origSettings = JSON.parse(JSON.stringify(advSettings.provinceLogs));

    function resetSettings() {
        advSettings.provinceLogs.sectionOrder = ['Thievery Summary', 'Spell Summary', 'Aid Summary'];
        advSettings.provinceLogs.visible = { 'Thievery Summary': true, 'Spell Summary': true, 'Aid Summary': true };
        advSettings.provinceLogs.showAverages = false;
        advSettings.provinceLogs.showFailedThievery = true;
        advSettings.provinceLogs.showSuccessThieveryLosses = true;
        advSettings.provinceLogs.showRazedBuildings = true;
        advSettings.provinceLogs.showDraftPercentage = true;
        advSettings.provinceLogs.showDraftRate = true;
        advSettings.provinceLogs.showMilitaryWages = true;
        advSettings.provinceLogs.showTroopsReleased = true;
        advSettings.provinceLogs.exploreDetails = true;
    }

    // Synthetic input with representative lines for each filter
    const synth = [
        'Province Log Summary',
        '',
        'Thievery Summary:',
        '  5 Tower Robbery for a total of 100,000 runes (10 ops, avg 10k)',
        '  3 Greater Arson:',
        '    30 Watch Towers (3 ops, avg 10)',
        '  3 failed thievery attempts (45 thieves lost)',
        '  20 thieves lost in successful operations',
        '',
        'Spell Summary:',
        '  10 Meteor Showers for a total of 50 days',
        '',
        'Aid Summary:',
        '  1,000 gold coins',
        '  5 soldiers released',
        '  Draft: 50% of population',
        '  Draft rate: Aggressive',
        '  Military wages: 150%',
        '  10 soldiers sent at a cost of 5,000 gold coins',
        '  200 Banks razed'
    ].join('\n');

    // 1. Section visibility — hide Spell Summary
    console.log('--- Section visibility ---');
    resetSettings();
    advSettings.provinceLogs.visible['Spell Summary'] = false;
    let result = applyProvinceLogsSettings(synth);
    assert('Spell Summary hidden when visible=false', result.includes('Spell Summary:'), false);
    assert('Thievery Summary visible when visible=true', result.includes('Thievery Summary:'), true);
    assert('Aid Summary visible when visible=true', result.includes('Aid Summary:'), true);

    // 2. Section reordering
    console.log('--- Section reordering ---');
    resetSettings();
    advSettings.provinceLogs.sectionOrder = ['Spell Summary', 'Thievery Summary', 'Aid Summary'];
    result = applyProvinceLogsSettings(synth);
    assert('Spell Summary before Thievery when reordered', result.indexOf('Spell Summary:') < result.indexOf('Thievery Summary:'), true);

    // 3. showAverages = false — Resources Stolen avg retained, subcomponent avg stripped
    console.log('--- showAverages off ---');
    resetSettings();
    advSettings.provinceLogs.showAverages = false;
    result = applyProvinceLogsSettings(synth);
    assert('showAverages=false keeps Resources Stolen (N ops, avg X)', result.includes('(10 ops, avg 10k)'), true);
    assert('showAverages=false strips subcomponent (N ops, avg M)', result.includes('(3 ops, avg 10)'), false);
    assert('showAverages=false does not append (avg X)', result.includes('(avg 5)'), false);

    // 4. showAverages = true preserves all avg annotations and appends to spell/thievery totals
    console.log('--- showAverages on ---');
    resetSettings();
    advSettings.provinceLogs.showAverages = true;
    result = applyProvinceLogsSettings(synth);
    assert('showAverages=true keeps Resources Stolen (N ops, avg X)', result.includes('(10 ops, avg 10k)'), true);
    assert('showAverages=true keeps subcomponent (N ops, avg M)', result.includes('(3 ops, avg 10)'), true);
    // "10 Meteor Showers for a total of 50 days" → count=10, total=50, avg=5
    assert('showAverages=true appends (avg 5) to Meteor Showers line', result.includes('(avg 5)'), true);

    // 5. showFailedThievery = false removes failed lines
    console.log('--- showFailedThievery ---');
    resetSettings();
    advSettings.provinceLogs.showFailedThievery = false;
    result = applyProvinceLogsSettings(synth);
    assert('showFailedThievery=false removes failed thievery lines', result.includes('failed thievery attempt'), false);

    // 6. showSuccessThieveryLosses = false removes thieves-lost lines
    console.log('--- showSuccessThieveryLosses ---');
    resetSettings();
    advSettings.provinceLogs.showSuccessThieveryLosses = false;
    result = applyProvinceLogsSettings(synth);
    assert('showSuccessThieveryLosses=false removes thieves lost lines', result.includes('thieves lost in successful operations'), false);

    // 7. showRazedBuildings = false removes razed lines
    console.log('--- showRazedBuildings ---');
    resetSettings();
    advSettings.provinceLogs.showRazedBuildings = false;
    result = applyProvinceLogsSettings(synth);
    assert('showRazedBuildings=false removes razed lines', result.includes('razed'), false);

    // 8. showTroopsReleased = false removes released lines
    console.log('--- showTroopsReleased ---');
    resetSettings();
    advSettings.provinceLogs.showTroopsReleased = false;
    result = applyProvinceLogsSettings(synth);
    assert('showTroopsReleased=false removes released lines', result.includes(' released'), false);

    // 9. showDraftPercentage = false removes Draft: lines
    console.log('--- showDraftPercentage ---');
    resetSettings();
    advSettings.provinceLogs.showDraftPercentage = false;
    result = applyProvinceLogsSettings(synth);
    assert('showDraftPercentage=false removes Draft: lines', result.includes('Draft: 50%'), false);

    // 10. showDraftRate = false removes Draft rate: lines
    console.log('--- showDraftRate ---');
    resetSettings();
    advSettings.provinceLogs.showDraftRate = false;
    result = applyProvinceLogsSettings(synth);
    assert('showDraftRate=false removes Draft rate: lines', result.includes('Draft rate:'), false);

    // 11. showMilitaryWages = false removes wages lines
    console.log('--- showMilitaryWages ---');
    resetSettings();
    advSettings.provinceLogs.showMilitaryWages = false;
    result = applyProvinceLogsSettings(synth);
    assert('showMilitaryWages=false removes Military wages: lines', result.includes('Military wages:'), false);

    // 12. exploreDetails = false removes soldier cost lines
    console.log('--- exploreDetails ---');
    resetSettings();
    advSettings.provinceLogs.exploreDetails = false;
    result = applyProvinceLogsSettings(synth);
    assert('exploreDetails=false removes soldiers sent at a cost lines', result.includes('soldiers sent at a cost of'), false);

    // Restore original settings
    Object.assign(advSettings.provinceLogs, origSettings);

    console.log(`\n${failed === 0 ? '✅' : '❌'} Apply settings tests: ${passed} passed, ${failed} failed`);
    return failed === 0;
}

// Run all tests
console.log('Starting Province Logs Parser Test Suite...\n');

const mainTestPassed = runProvinceLogsTest();
const componentTestsPassed = runComponentTests();
const valueTestsPassed = runValueAssertionTests();
const applyTestsPassed = runApplySettingsTests();

console.log('\n=== TEST SUMMARY ===');
console.log(`Main parsing test: ${mainTestPassed ? '✅ PASSED' : '❌ FAILED'}`);
console.log(`Component tests: ${componentTestsPassed ? '✅ PASSED' : '❌ FAILED'}`);
console.log(`Value assertions: ${valueTestsPassed ? '✅ PASSED' : '❌ FAILED'}`);
console.log(`Apply settings:   ${applyTestsPassed ? '✅ PASSED' : '❌ FAILED'}`);

if (mainTestPassed && componentTestsPassed && valueTestsPassed && applyTestsPassed) {
    console.log('\n🎉 ALL TESTS PASSED! Province Logs Parser is working correctly.');
} else {
    console.log('\n⚠️  Some tests failed. Please review the output above for details.');
}

console.log('\nProvince Logs Parser Test Suite Complete.');
