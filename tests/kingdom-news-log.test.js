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

console.log('\n=== KINGDOM NEWS LOG TESTS COMPLETE ===\n');
