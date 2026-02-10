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
        expected: 'Line 1\nLine 2\nLine 3\n\nLine 4'
    },
    {
        name: 'Complex real-world example',
        input: '<div class="content">\n  <h1>Title</h1>\n  <p>Some &amp; text with <em>formatting</em></p>\n  <p>Multiple   spaces</p>\n</div>',
        expected: 'Title\n Some & text with formatting\n Multiple spaces'
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
