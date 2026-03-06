/**
 * Parser Test Suite
 * Tests the text parsing functionality
 */

// Import parser functions (for Node.js testing environment)
const parser = require('../js/parser.js');

// Test data
const testCases = [
    {
        name: 'Basic HTML tag removal',
        input: '<p>Hello <strong>World</strong></p>',
        expected: 'Hello World'
    },
    {
        name: 'HTML entity cleanup',
        input: 'Hello &amp; World &lt;test&gt;',
        expected: 'Hello & World <test>'
    },
    {
        name: 'Whitespace normalization',
        input: 'Hello    World\t\tTest',
        expected: 'Hello World Test'
    },
    {
        name: 'Line break normalization',
        input: 'Line 1\r\nLine 2\rLine 3\n\n\nLine 4',
        expected: 'Line 1\nLine 2 Line 3\n\n\nLine 4'
    },
    {
        name: 'Complex real-world example',
        input: '<div class="content">\n  <h1>Title</h1>\n  <p>Some &amp; text with <em>formatting</em></p>\n  <p>Multiple   spaces</p>\n</div>',
        expected: '\nTitle\nSome & text with formatting\nMultiple spaces\n'
    },
    {
        name: 'Empty string',
        input: '',
        expected: ''
    },
    {
        name: 'Smart quotes conversion',
        input: '"Hello" \'world\' and "test"',
        expected: '"Hello" \'world\' and "test"'
    },
    {
        name: 'Mobile to WYSIWYG forum line breaks',
        input: 'Attack on 5:2\n\nOur forces attacked the enemy kingdom.\n\nResults:\n• 500 acres captured\n• 200 troops lost\n\nSuccess!',
        expected: 'Attack on 5:2\n\nOur forces attacked the enemy kingdom.\n\nResults:\n• 500 acres captured\n• 200 troops lost\n\nSuccess!'
    },
    {
        name: 'Mobile copy-paste with mixed line breaks',
        input: 'Kingdom News Report\r\n\r\nOur kingdom: 12:34\r\nEnemy: 5:2\r\n\r\nHighlights:\r\n• Successful attacks\r\n• Defense held\r\n\r\nCasualties minimal.',
        expected: 'Kingdom News Report\n\nOur kingdom: 12:34\nEnemy: 5:2\n\nHighlights:\n• Successful attacks\n• Defense held\n\nCasualties minimal.'
    }
];

// Run tests
console.log('Running NewsParser Tests...\n');

let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach((testCase, index) => {
    try {
        const result = parser.parseText(testCase.input);
        const passed = result === testCase.expected;
        
        if (passed) {
            console.log(`✅ Test ${index + 1}: ${testCase.name} - PASSED`);
            passedTests++;
        } else {
            console.log(`❌ Test ${index + 1}: ${testCase.name} - FAILED`);
            console.log(`   Input: ${JSON.stringify(testCase.input)}`);
            console.log(`   Expected: ${JSON.stringify(testCase.expected)}`);
            console.log(`   Got: ${JSON.stringify(result)}`);
        }
    } catch (error) {
        console.log(`❌ Test ${index + 1}: ${testCase.name} - ERROR`);
        console.log(`   Error: ${error.message}`);
    }
});

console.log(`\nTest Results: ${passedTests}/${totalTests} tests passed`);

// Test individual functions
console.log('\n--- Individual Function Tests ---');

// Test HTML tag removal
const htmlTest = parser.removeHtmlTags('<p>Hello <strong>World</strong></p>');
console.log(`HTML tag removal: ${htmlTest === 'Hello World' ? '✅ PASSED' : '❌ FAILED'}`);

// Test entity removal
const entityTest = parser.removeHtmlEntities('Hello &amp; World');
console.log(`Entity removal: ${entityTest === 'Hello & World' ? '✅ PASSED' : '❌ FAILED'}`);

// Test whitespace normalization
const whitespaceTest = parser.normalizeWhitespace('Hello    World');
console.log(`Whitespace normalization: ${whitespaceTest === 'Hello World' ? '✅ PASSED' : '❌ FAILED'}`);

console.log('\nAll tests completed!');

// ─── detectInputType tests ────────────────────────────────────────────────────

console.log('\n--- detectInputType ---');

const { detectInputType } = parser;
let dPassed = 0, dFailed = 0;
function dAssert(desc, got, expected) {
    if (got === expected) {
        console.log(`  PASS: ${desc}`);
        dPassed++;
    } else {
        console.error(`  FAIL: ${desc}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}`);
        dFailed++;
    }
}

// Province Logs markers (each one should produce 'province-logs')
dAssert('early indications → province-logs',
    detectInputType('February 1 of YR0 Early indications show that our operation was a success'),
    'province-logs');
dAssert('your wizards gather → province-logs',
    detectInputType('March 5 of YR1 Your wizards gather their power'),
    'province-logs');
dAssert('you have ordered → province-logs',
    detectInputType('January 3 of YR2 You have ordered your troops to march'),
    'province-logs');
dAssert('you have given orders to commence work → province-logs',
    detectInputType('April 2 of YR1 You have given orders to commence work on 5 Guilds'),
    'province-logs');
dAssert('begin casting → province-logs',
    detectInputType('May 10 of YR0 begin casting Fireball'),
    'province-logs');
dAssert('we have sent → province-logs',
    detectInputType('June 1 of YR1 We have sent 5,000 gold coins to our ally'),
    'province-logs');
dAssert('our thieves have returned with → province-logs',
    detectInputType('July 20 of YR0 Our thieves have returned with 10,000 runes'),
    'province-logs');
dAssert('our thieves were able to steal → province-logs',
    detectInputType('February 3 of YR2 Our thieves were able to steal 5,000 gold coins'),
    'province-logs');

// Kingdom News markers (each should produce 'kingdom-news-log')
dAssert('captured N acres of land → kingdom-news-log',
    detectInputType('February 1 of YR0\t15 - Province (5:1) captured 100 acres of land from 20 - Target (4:1).'),
    'kingdom-news-log');
dAssert('ambushed armies from → kingdom-news-log',
    detectInputType('March 3 of YR1\t7 - Province (5:1) ambushed armies from 4:1'),
    'kingdom-news-log');
dAssert('razed N acres of → kingdom-news-log',
    detectInputType('April 4 of YR1\t3 - Province (5:1) razed 50 acres of 4:1'),
    'kingdom-news-log');
dAssert('invaded and looted → kingdom-news-log',
    detectInputType('May 5 of YR1\t8 - Province (5:1) invaded and looted 4:1'),
    'kingdom-news-log');
dAssert('killed N people → kingdom-news-log',
    detectInputType('June 6 of YR2\t9 - Province (5:1) killed 500 people'),
    'kingdom-news-log');
dAssert('attempted an invasion of → kingdom-news-log',
    detectInputType('July 7 of YR2\t2 - Province (5:1) attempted an invasion of 4:1'),
    'kingdom-news-log');
dAssert('but was repelled → kingdom-news-log',
    detectInputType('January 1 of YR3\t4 - Province (5:1) attempted an invasion but was repelled'),
    'kingdom-news-log');

// Province News marker (tab-delimited date format)
dAssert('tab-delimited date → province-news',
    detectInputType('February 1 of YR1\tOur people decided to explore new territories'),
    'province-news');

// Null for unrecognized input
dAssert('random text → null',
    detectInputType('This is some random unrecognized text'),
    null);
dAssert('empty-ish text → null',
    detectInputType('   '),
    null);

// Kingdom News takes priority over Province Logs when both markers are present
const bothMarkers = 'begin casting Meteor Shower\nFebruary 1 of YR0\t15 - Province (5:1) captured 100 acres of land from 20 - Target (4:1).';
dAssert('kingdom-news takes priority over province-logs',
    detectInputType(bothMarkers),
    'kingdom-news-log');

// Province Logs takes priority over Province News (province-news detection reached only if no ops/spells)
const logsAndNews = 'February 1 of YR1\tOur people decided to explore\nMarch 5 of YR0 Your wizards gather their power';
dAssert('province-logs takes priority over province-news tab format',
    detectInputType(logsAndNews),
    'province-logs');

console.log(`\ndetectInputType: ${dPassed} passed, ${dFailed} failed`);
if (dFailed > 0) process.exitCode = 1;
