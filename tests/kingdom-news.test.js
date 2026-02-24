/**
 * Kingdom News Report Parser Test Suite
 * Tests the Kingdom News Report reformatting functionality
 */

const fs = require('fs');
const path = require('path');

// Import parser functions
const parser = require('../js/parser.js');

// Read test files
const originalText = fs.readFileSync(
    path.join(__dirname, 'Kingdom News Report original.txt'), 
    'utf8'
);
const expectedText = fs.readFileSync(
    path.join(__dirname, 'Kingdom News Report modified.txt'), 
    'utf8'
);

console.log('Running Kingdom News Report Parser Tests...\n');

// Test the Kingdom News parsing
try {
    console.log('🧪 Testing Kingdom News Report parsing...');
    
    const result = parser.parseKingdomNewsReport(originalText);
    
    // Normalize line endings for comparison
    const normalizeLineEndings = (text) => text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
    
    const normalizedResult = normalizeLineEndings(result);
    const normalizedExpected = normalizeLineEndings(expectedText);
    
    if (normalizedResult === normalizedExpected) {
        console.log('✅ Kingdom News Report parsing test - PASSED');
        console.log('✅ Output matches expected modified format exactly');
    } else {
        console.log('❌ Kingdom News Report parsing test - FAILED');
        console.log('Differences found:');
        
        const resultLines = normalizedResult.split('\n');
        const expectedLines = normalizedExpected.split('\n');
        
        const maxLines = Math.max(resultLines.length, expectedLines.length);
        
        for (let i = 0; i < maxLines; i++) {
            if (resultLines[i] !== expectedLines[i]) {
                console.log(`   Line ${i + 1}:`);
                console.log(`     Expected: "${expectedLines[i]}"`);
                console.log(`     Got:      "${resultLines[i]}"`);
            }
        }
        
        // Show first 200 characters of each for quick comparison
        console.log('\nFirst 200 characters comparison:');
        console.log(`Expected: "${normalizedExpected.substring(0, 200)}..."`);
        console.log(`Got:      "${normalizedResult.substring(0, 200)}..."`);
    }
    
} catch (error) {
    console.log('❌ Kingdom News Report parsing test - ERROR');
    console.log(`   Error: ${error.message}`);
}

// Test individual components
console.log('\n--- Component Tests ---');

try {
    // Test that the function exists and is callable
    const result = parser.parseKingdomNewsReport(originalText);
    
    console.log(`✅ Function availability test - PASSED`);
    console.log(`   Result length: ${result.length} characters`);
    console.log(`   Function is callable and returns a string`);
    
} catch (error) {
    console.log(`❌ Component test - ERROR: ${error.message}`);
}

console.log('\nKingdom News Report tests completed!');
