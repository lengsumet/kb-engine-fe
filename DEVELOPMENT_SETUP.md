# Development Setup for Chat Bot

## CORS Issue Fix

The chat bot API requires a proxy server in development to avoid CORS issues.

## Quick Start

### Option 1: Run with Proxy (Recommended)
```bash
npm run dev
```
This command will:
1. Start the proxy server on port 3001
2. Start the React development server on port 3000
3. Handle CORS issues automatically

### Option 2: Manual Setup
```bash
# Terminal 1: Start proxy server
npm run proxy

# Terminal 2: Start React app
npm start
```

## How it Works

1. **Development Mode**: Chat requests go to `http://localhost:3001/api/search` (proxy server)
2. **Production Mode**: Chat requests go directly to `https://bgvlxbztee.execute-api.us-east-1.amazonaws.com/api/search`

## Proxy Server Details

- **File**: `proxy-server.js`
- **Port**: 3001
- **Purpose**: Forwards requests to the actual API and handles CORS headers
- **Endpoint**: `POST http://localhost:3001/api/search`

## Environment Variables

```bash
# .env.development
REACT_APP_SEARCH_API_URL=https://bgvlxbztee.execute-api.us-east-1.amazonaws.com/api/search
```

## Troubleshooting

### CORS Error
If you see CORS errors, make sure:
1. Proxy server is running on port 3001
2. Use `npm run dev` instead of `npm start`
3. Check that port 3001 is not blocked

### API Connection Issues
1. Check if the API endpoint is accessible
2. Verify the API URL in `.env.development`
3. Check proxy server logs for error details

### Port Conflicts
If port 3001 is in use:
1. Kill the process using port 3001
2. Or modify `proxy-server.js` to use a different port
3. Update the chatService.js accordingly

## Testing the Setup

1. Start the development server: `npm run dev`
2. Open the chat bot on any page
3. Send a test message like "สวัสดี"
4. Check browser console for any errors
5. Check proxy server terminal for request logs

## Production Deployment

In production, the proxy server is not needed. The app will directly connect to the API endpoint specified in `REACT_APP_SEARCH_API_URL`.