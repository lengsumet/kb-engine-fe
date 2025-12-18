# Search API Integration

This document describes the integration of the external search API into the KB Engine frontend.

## API Details

- **URL**: `https://bgvlxbztee.execute-api.us-east-1.amazonaws.com/api/search`
- **Method**: POST
- **Content-Type**: application/json

### Request Format
```json
{
  "question": "Your search question here"
}
```

### Response Format
```json
{
  "answer": "The AI-generated answer to your question"
}
```

## Implementation

### Files Modified/Created

1. **`src/services/searchService.js`** - New service for API integration
2. **`src/pages/SearchPage.js`** - Updated to use the new search service
3. **`src/components/SearchResults.js`** - Enhanced to display API responses
4. **`src/components/SearchResults.css`** - Added styles for API results
5. **`.env.development`** and **`.env.production`** - Added API URL configuration

### Environment Variables

Add the following to your environment files:

```bash
# Search API Configuration
REACT_APP_SEARCH_API_URL=https://bgvlxbztee.execute-api.us-east-1.amazonaws.com/api/search
```

## Usage

1. Navigate to the search page
2. Enter your question in the search box
3. Click "ค้นหา" (Search)
4. The API will be called and the response will be displayed

## Features

- **Error Handling**: Graceful error handling with user-friendly messages
- **Loading States**: Shows loading spinner during API calls
- **Response Formatting**: Properly formats and displays API responses
- **Environment Configuration**: Configurable API URL via environment variables

## Testing

For development testing, you can use the browser console:

```javascript
// Test the API integration
testSearchAPI();
```

## Error Handling

The integration handles various error scenarios:

1. **Network Errors**: Connection issues, timeouts
2. **API Errors**: HTTP error responses (4xx, 5xx)
3. **Invalid Responses**: Malformed JSON or missing data
4. **Empty Questions**: Validation for empty or whitespace-only queries

## Display Features

- **AI Response Indicator**: Special styling for API responses with robot emoji
- **Error Display**: Clear error messages with warning indicators
- **Source Attribution**: Shows "ตอบโดย AI Search API" for API responses
- **Responsive Design**: Works on all screen sizes

## Future Enhancements

- Add response caching to improve performance
- Implement request debouncing for better UX
- Add support for follow-up questions
- Integrate with existing document search results