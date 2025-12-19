import { searchMockDocuments } from '../data/mockSearchData';

// Service for handling search operations
class SearchService {
  constructor() {
    // Get API URL from environment variables
    this.apiUrl = process.env.REACT_APP_SEARCH_API_URL || 'http://localhost:8000/search';
    this.useMockData = process.env.REACT_APP_USE_MOCK_DATA === 'true' || !process.env.REACT_APP_SEARCH_API_URL;
    
    console.log('SearchService initialized:', {
      apiUrl: this.apiUrl,
      useMockData: this.useMockData
    });
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
      'default': `ขออภัย ขณะนี้ระบบค้นหากำลังมีปัญหาชั่วคราว\n\nสำหรับคำถาม: "${query}"\n\nกรุณาลองใหม่อีกครั้งในภายหลัง หรือใช้ฟีเจอร์ค้นหาเอกสารแทน`
    };

    const answer = mockAnswers[query.toLowerCase()] || mockAnswers.default;
    
    return {
      answer: answer,
      question: query,
      timestamp: new Date().toISOString(),
      isMock: true
    };
  }

  // Handle search with mock data
  async performSearch(query, filters = {}) {
    try {
      // Simulate search delay for realistic experience
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
      
      // Use mock data for search
      const results = searchMockDocuments(query, filters);
      
      if (results.length === 0) {
        return [{
          id: Date.now(),
          title: 'ไม่พบผลการค้นหา',
          content: `ไม่พบเอกสารที่เกี่ยวข้องกับ "${query}" ลองใช้คำค้นหาอื่น หรือตรวจสอบการสะกดคำ`,
          category: 'no-results',
          fileType: 'info',
          lastUpdated: new Date().toLocaleDateString('th-TH'),
          relevanceScore: 0,
          searchType: 'mock',
          highlights: [],
          isNoResults: true
        }];
      }
      
      return results;
    } catch (error) {
      console.error('Search error:', error);
      return [{
        id: Date.now(),
        title: 'เกิดข้อผิดพลาดในการค้นหา',
        content: 'ไม่สามารถค้นหาข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง',
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