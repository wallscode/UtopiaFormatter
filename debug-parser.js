const parser = require('./js/parser.js');
const fs = require('fs');
const path = require('path');

// Read test files
const originalText = fs.readFileSync(
    path.join(__dirname, 'Kingdom News Report original.txt'), 
    'utf8'
);

console.log('=== DEBUGGING DYNAMIC KINGDOM DETECTION ===\n');

// Show cleaning process step by step
let cleanedText = originalText;
console.log('Original text length:', cleanedText.length);

cleanedText = parser.removeHtmlTags(cleanedText);
console.log('After removeHtmlTags length:', cleanedText.length);

cleanedText = parser.removeHtmlEntities(cleanedText);
console.log('After removeHtmlEntities length:', cleanedText.length);

cleanedText = parser.normalizeWhitespace(cleanedText);
console.log('After normalizeWhitespace length:', cleanedText.length);

cleanedText = parser.removeProblematicCharacters(cleanedText);
console.log('After removeProblematicCharacters length:', cleanedText.length);

cleanedText = parser.normalizeLineBreaks(cleanedText);
console.log('After normalizeLineBreaks length:', cleanedText.length);

const lines = cleanedText.split('\n').map(line => line.trim()).filter(line => line);
console.log('\nTotal lines after cleaning:', lines.length);

console.log('\n--- Looking for kingdom identifiers ---');
console.log('Lines with "Own Kingdom":', lines.filter(line => line.includes('Own Kingdom')));
console.log('Lines with "The Kingdom of":', lines.filter(line => line.includes('The Kingdom of')));

// Show lines around where kingdom identifiers should be
console.log('\n--- Lines 25-35 (should contain kingdom identifiers) ---');
for (let i = 24; i < Math.min(35, lines.length); i++) {
    console.log(`${i+1}: "${lines[i]}"`);
}
