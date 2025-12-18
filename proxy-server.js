const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Proxy endpoint for the search API
app.post('/api/search', async (req, res) => {
  try {
    console.log('Proxy received request:', req.body);
    
    const response = await fetch('https://bgvlxbztee.execute-api.us-east-1.amazonaws.com/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });

    console.log('API response status:', response.status);
    console.log('API response headers:', response.headers.raw());

    const responseText = await response.text();
    console.log('API response text:', responseText);

    if (!response.ok) {
      // Return the actual error response from the API
      res.status(response.status).json({ 
        error: 'API Error', 
        status: response.status,
        message: responseText 
      });
      return;
    }

    try {
      const data = JSON.parse(responseText);
      console.log('API response data:', data);
      res.json(data);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      res.status(500).json({ 
        error: 'Invalid JSON response from API', 
        response: responseText 
      });
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy server error', 
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});