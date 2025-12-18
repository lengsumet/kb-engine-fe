# AI Chat Bot Implementation

## Overview
This implementation provides a custom AI chat bot that integrates with the `REACT_APP_SEARCH_API_URL` to provide real-time responses to user questions.

## Components

### 1. InteractiveChat Component (`src/components/InteractiveChat.js`)
The main chat bot component with comprehensive features:
- **Real-time API Integration**: Uses `REACT_APP_SEARCH_API_URL` for responses
- **Conversation History**: Maintains chat history for context
- **Suggested Questions**: Provides relevant follow-up questions
- **Message Actions**: Copy messages, clear chat history
- **API Status Monitoring**: Shows connection status
- **Improved UI**: Better animations and styling
- **Error Handling**: Graceful error handling with fallbacks
- **Minimizable Interface**: Can be minimized while keeping functionality
- **Responsive Design**: Works on desktop and mobile

### 2. ChatService (`src/services/chatService.js`)
Service layer for chat functionality:
- **API Communication**: Handles all API calls to `REACT_APP_SEARCH_API_URL`
- **Conversation Management**: Manages chat history and context
- **Follow-up Generation**: Generates relevant follow-up questions
- **Health Monitoring**: Checks API availability

## API Integration

### Environment Configuration
```bash
# .env.development
REACT_APP_SEARCH_API_URL=https://bgvlxbztee.execute-api.us-east-1.amazonaws.com/api/search
```

### API Request Format
```javascript
{
  "question": "user question here",
  "context": [
    {
      "user": "previous user message",
      "bot": "previous bot response",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### API Response Format
```javascript
{
  "answer": "AI generated response",
  "confidence": 0.85,
  "sources": ["source1", "source2"],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Features

### 🤖 AI Integration
- Real-time responses from search API
- Confidence scoring for answers
- Context-aware conversations
- Automatic follow-up question generation

### 💬 Chat Interface
- Modern, responsive design
- Typing indicators and animations
- Message timestamps and actions
- Suggested questions for better UX

### 🔧 Technical Features
- Error handling with fallback responses
- API health monitoring
- Conversation history management
- Mobile-responsive design
- Dark mode support

### 🎨 UI/UX Features
- Smooth animations and transitions
- Copy message functionality
- Clear chat history option
- Minimizable chat window
- Status indicators

## Usage

### Basic Implementation
```jsx
import InteractiveChat from './components/InteractiveChat';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState('');

  const handleOpenChatWithQuery = (query) => {
    setInitialQuery(query);
    setIsChatOpen(true);
  };

  return (
    <div>
      <InteractiveChat 
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        initialQuery={initialQuery}
      />
    </div>
  );
}
```

## Testing

### Test Page
Visit `/chat-test` to access the chat bot test page with:
- API configuration display
- Connection status monitoring
- Sample questions for testing
- Feature overview

### Sample Test Questions
- "สวัสดี" - Basic greeting
- "นโยบายการลาพักร้อน" - Leave policy
- "ขั้นตอนการอนุมัติสินเชื่อ" - Loan approval process
- "วิธีแก้ไขปัญหาระบบ IT" - IT troubleshooting
- "วันหยุดประจำปี 2568-2569" - Holiday schedule

## Error Handling

The chat bot includes comprehensive error handling:

1. **Network Errors**: Shows connection issues
2. **API Errors**: Displays server error messages
3. **Timeout Handling**: Manages slow responses
4. **Fallback Responses**: Provides helpful messages when API fails

## Customization

### Styling
- Modify `ChatBot.css` or `InteractiveChat.css` for custom styling
- CSS variables available for easy theming
- Dark mode support included

### API Integration
- Update `chatService.js` to modify API behavior
- Customize request/response formatting
- Add additional API endpoints

### Features
- Extend `generateFollowUpQuestions()` for better suggestions
- Modify `getSuggestedQuestions()` for different default questions
- Add new message types and formatting

## Performance

### Optimizations
- Lazy loading of components
- Efficient re-rendering with React hooks
- Conversation history limits (10 pairs max)
- Debounced API calls

### Memory Management
- Automatic cleanup of old conversations
- Efficient state management
- Minimal re-renders

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design for all screen sizes
- Progressive enhancement for older browsers

## Dependencies

- React 18+
- Lucide React (for icons)
- Modern CSS features (Grid, Flexbox, CSS Variables)

## Future Enhancements

- [ ] Voice input/output support
- [ ] File upload capability
- [ ] Multi-language support
- [ ] Advanced conversation analytics
- [ ] Integration with more AI services
- [ ] Offline mode support