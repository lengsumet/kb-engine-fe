// Simple test script to verify mock data functionality
const { searchMockDocuments, getPopularSearchTerms, getDocumentCategories } = require('./src/data/mockSearchData');

console.log('=== Testing Mock Data ===\n');

// Test 1: Search for "incentive"
console.log('1. Testing search for "incentive":');
const incentiveResults = searchMockDocuments('incentive');
console.log(`Found ${incentiveResults.length} results`);
incentiveResults.forEach(result => {
  console.log(`- ${result.title} (Category: ${result.category})`);
});

console.log('\n2. Testing search for "สินเชื่อ":');
const creditResults = searchMockDocuments('สินเชื่อ');
console.log(`Found ${creditResults.length} results`);
creditResults.forEach(result => {
  console.log(`- ${result.title} (Category: ${result.category})`);
});

console.log('\n3. Testing search for "อบรม":');
const trainingResults = searchMockDocuments('อบรม');
console.log(`Found ${trainingResults.length} results`);
trainingResults.forEach(result => {
  console.log(`- ${result.title} (Category: ${result.category})`);
});

console.log('\n4. Popular search terms:');
const popularTerms = getPopularSearchTerms();
popularTerms.forEach(term => console.log(`- ${term}`));

console.log('\n5. Document categories:');
const categories = getDocumentCategories();
categories.forEach(cat => console.log(`- ${cat.label} (${cat.count} documents)`));

console.log('\n=== Test Complete ===');