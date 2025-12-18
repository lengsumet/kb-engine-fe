// Test utility for the search API
import searchService from '../services/searchService';

// Test function to verify API integration
export const testSearchAPI = async () => {
  console.log('Testing Search API...');
  
  try {
    // Test with a simple question
    const testQuestion = "What is the weather today?";
    console.log(`Testing with question: "${testQuestion}"`);
    
    const result = await searchService.performSearch(testQuestion);
    console.log('API Response:', result);
    
    if (result && result.length > 0) {
      console.log('✅ API test successful!');
      console.log('Answer:', result[0].content);
      return true;
    } else {
      console.log('❌ API test failed - no results returned');
      return false;
    }
  } catch (error) {
    console.error('❌ API test failed with error:', error);
    return false;
  }
};

// Test function that can be called from browser console
window.testSearchAPI = testSearchAPI;