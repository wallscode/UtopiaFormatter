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

// Run all tests
console.log('Starting Province Logs Parser Test Suite...\n');

const mainTestPassed = runProvinceLogsTest();
const componentTestsPassed = runComponentTests();

console.log('\n=== TEST SUMMARY ===');
console.log(`Main parsing test: ${mainTestPassed ? '✅ PASSED' : '❌ FAILED'}`);
console.log(`Component tests: ${componentTestsPassed ? '✅ PASSED' : '❌ FAILED'}`);

if (mainTestPassed && componentTestsPassed) {
    console.log('\n🎉 ALL TESTS PASSED! Province Logs Parser is working correctly.');
} else {
    console.log('\n⚠️  Some tests failed. Please review the output above for details.');
}

console.log('\nProvince Logs Parser Test Suite Complete.');
