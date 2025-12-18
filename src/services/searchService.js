// Service for handling search API operations
class SearchService {
  constructor() {
    // Use proxy server in development, direct API in production
    if (process.env.NODE_ENV === 'development') {
      this.apiUrl = 'http://localhost:3001/api/search';
    } else {
      this.apiUrl = process.env.REACT_APP_SEARCH_API_URL
    }
  }

  // Main search function that calls the API
  async search(question) {
    if (!question || question.trim() === '') {
      throw new Error('Question is required');
    }

    try {
      console.log('Making API request to:', this.apiUrl);
      console.log('Request payload:', { question: question.trim() });

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        mode: 'cors', // Explicitly set CORS mode
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          question: question.trim()
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response data:', data);
      
      // The API returns an "answer" field
      return {
        answer: data.answer || 'ไม่พบคำตอบสำหรับคำถามนี้',
        question: question,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Search API error:', error);
      
      // Provide more specific error messages
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('ไม่สามารถเชื่อมต่อกับ API ได้ (CORS หรือ Network Error)');
      } else if (error.message.includes('HTTP error')) {
        throw new Error(`API Error: ${error.message}`);
      } else {
        throw new Error(`การค้นหาล้มเหลว: ${error.message}`);
      }
    }
  }

  // Format the search result for display
  formatSearchResult(result) {
    return {
      id: Date.now(),
      title: `คำตอบสำหรับ: ${result.question}`,
      content: result.answer,
      category: 'search-result',
      fileType: 'api-response',
      lastUpdated: new Date().toLocaleDateString('th-TH'),
      relevanceScore: 1.0,
      searchType: 'api',
      highlights: [result.question],
      timestamp: result.timestamp
    };
  }

  // Fallback mock response when API is not available
  getMockResponse(query) {
    const mockAnswers = {
      'hello': 'สวัสดีครับ! ยินดีต้อนรับสู่ระบบค้นหาข้อมูล คุณสามารถถามคำถามเกี่ยวกับเอกสาร นโยบาย หรือข้อมูลต่างๆ ได้',
      'test': 'ระบบทำงานปกติ คุณสามารถค้นหาข้อมูลได้ตามปกติ',
      'weather': 'ขออภัย ระบบนี้ไม่มีข้อมูลสภาพอากาศ แต่สามารถค้นหาข้อมูลเอกสารและนโยบายต่างๆ ได้',
      'default': `ขออภัย ขณะนี้ระบบ AI Search API กำลังมีปัญหาชั่วคราว\n\nสำหรับคำถาม: "${query}"\n\nกรุณาลองใหม่อีกครั้งในภายหลัง หรือใช้ฟีเจอร์ค้นหาเอกสารแทน`
    };

    const answer = mockAnswers[query.toLowerCase()] || mockAnswers.default;
    
    return {
      answer: answer,
      question: query,
      timestamp: new Date().toISOString(),
      isMock: true
    };
  }

  // Handle search with error handling and formatting
  async performSearch(query) {
    try {
      const result = await this.search(query);
      return [this.formatSearchResult(result)];
    } catch (error) {
      console.log('API failed, using fallback response');
      
      // Check if it's an API error (500) - provide mock response
      if (error.message.includes('API Error') || error.message.includes('500')) {
        const mockResult = this.getMockResponse(query);
        const formattedResult = this.formatSearchResult(mockResult);
        formattedResult.title = `คำตอบจำลอง: ${query}`;
        formattedResult.category = 'mock-result';
        return [formattedResult];
      }
      
      // For other errors, return error message
      return [{
        id: Date.now(),
        title: 'เกิดข้อผิดพลาดในการค้นหา',
        content: error.message,
        category: 'error',
        fileType: 'error',
        lastUpdated: new Date().toLocaleDateString('th-TH'),
        relevanceScore: 0,
        searchType: 'error',
        highlights: [],
        isError: true
      }];
    }
  }
}

export default new SearchService();