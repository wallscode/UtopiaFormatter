// Test require function
const parser = require('./parser-corrected.js');

console.log('Testing require...');
console.log('parseKingdomNewsReport function:', typeof parser.parseKingdomNewsReport);
console.log('Available functions:', Object.keys(parser));

// Test the function
try {
    const testInput = "Kingdom News Report\nFebruary 2, YR0 - February 24, YR0 (23 days)\nTotal Attacks Made: 118 (3462 acres)\nUniques: 46";
    const result = parser.parseKingdomNewsReport(testInput);
    console.log('Test result length:', result.length);
    console.log('First 200 characters:');
    console.log(result.split('\n').slice(0, 200).join('\n'));
} catch (error) {
    console.error('Test failed:', error);
}
