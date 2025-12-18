// Service for handling chat-specific API operations
class ChatService {
  constructor() {
    // Use proxy server in development, direct API in production
    if (process.env.NODE_ENV === 'development') {
      this.apiUrl = 'http://localhost:3001/api/search';
    } else {
      this.apiUrl = process.env.REACT_APP_SEARCH_API_URL
    }
    this.conversationHistory = [];
  }

  // Send a chat message and get AI response
  async sendMessage(message, includeHistory = false) {
    if (!message || message.trim() === '') {
      throw new Error('Message is required');
    }

    try {
      console.log('Sending chat message to:', this.apiUrl);
      
      // Prepare the request payload
      const payload = {
        question: message.trim(),
        // Optionally include conversation history for context
        ...(includeHistory && this.conversationHistory.length > 0 && {
          context: this.conversationHistory.slice(-5) // Last 5 messages for context
        })
      };

      console.log('Chat request payload:', payload);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('Chat API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Chat API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Chat API Response data:', data);
      
      // Store conversation history
      this.addToHistory(message, data.answer);
      
      // Return formatted response
      return {
        answer: data.answer || 'ขออภัย ไม่สามารถสร้างคำตอบได้ในขณะนี้',
        confidence: data.confidence || 0.85,
        sources: data.sources || [],
        timestamp: new Date().toISOString(),
        messageId: Date.now()
      };
    } catch (error) {
      console.error('Chat API error:', error);
      
      // Provide specific error handling
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        if (process.env.NODE_ENV === 'development') {
          throw new Error('ไม่สามารถเชื่อมต่อกับ Proxy Server ได้\n\nกรุณาเริ่มต้น development server ด้วยคำสั่ง:\nnpm run dev\n\nหรือเริ่ม proxy server แยก:\nnpm run proxy');
        } else {
          throw new Error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
        }
      } else if (error.message.includes('HTTP error')) {
        throw new Error(`เซิร์ฟเวอร์ตอบสนองผิดพลาด: ${error.message}`);
      } else {
        throw new Error(`เกิดข้อผิดพลาดในการส่งข้อความ: ${error.message}`);
      }
    }
  }

  // Add message pair to conversation history
  addToHistory(userMessage, botResponse) {
    this.conversationHistory.push({
      user: userMessage,
      bot: botResponse,
      timestamp: new Date().toISOString()
    });

    // Keep only last 10 conversation pairs to manage memory
    if (this.conversationHistory.length > 10) {
      this.conversationHistory = this.conversationHistory.slice(-10);
    }
  }

  // Clear conversation history
  clearHistory() {
    this.conversationHistory = [];
  }

  // Get conversation history
  getHistory() {
    return this.conversationHistory;
  }

  // Generate contextual follow-up questions based on the response
  generateFollowUpQuestions(response) {
    const followUps = [];
    const content = response.answer.toLowerCase();

    // Generate relevant follow-up questions based on content
    if (content.includes('ลา') || content.includes('พักร้อน')) {
      followUps.push(
        'วิธีการยื่นคำขอลาพักร้อนออนไลน์',
        'นโยบายการลาป่วยเป็นอย่างไร',
        'สามารถสะสมวันลาได้กี่วัน'
      );
    } else if (content.includes('สินเชื่อ') || content.includes('อนุมัติ')) {
      followUps.push(
        'เอกสารที่ต้องใช้ในการขอสินเชื่อ',
        'อัตราดอกเบี้ยสินเชื่อปัจจุบัน',
        'ระยะเวลาการผ่อนชำระสูงสุด'
      );
    } else if (content.includes('it') || content.includes('ระบบ')) {
      followUps.push(
        'วิธีการรีเซ็ตรหัสผ่านระบบ',
        'การขอสิทธิ์เข้าใช้ระบบใหม่',
        'ช่องทางติดต่อ IT Support'
      );
    } else if (content.includes('วันหยุด')) {
      followUps.push(
        'วันหยุดชดเชยในปีนี้',
        'นโยบายการทำงานในวันหยุด',
        'การขอหยุดงานเพิ่มเติม'
      );
    } else {
      // Generic follow-ups
      followUps.push(
        'มีข้อมูลเพิ่มเติมเกี่ยวกับเรื่องนี้ไหม',
        'ขั้นตอนถัดไปคืออะไร',
        'มีเอกสารอ้างอิงไหม'
      );
    }

    return followUps.slice(0, 3); // Return max 3 follow-ups
  }

  // Get suggested questions for new users
  getSuggestedQuestions() {
    return [
      'นโยบายการลาพักร้อนเป็นอย่างไร',
      'ขั้นตอนการขอสินเชื่อบ้าน',
      'วันหยุดประจำปี 2568-2569',
      'วิธีแก้ไขปัญหาระบบ IT',
      'การขอใบรับรองเงินเดือน',
      'นโยบายการทำงานจากที่บ้าน',
      'ขั้นตอนการลาออกจากงาน',
      'สวัสดิการพนักงานมีอะไรบ้าง'
    ];
  }

  // Format message for display in chat
  formatChatMessage(content, type = 'bot', options = {}) {
    return {
      id: options.id || Date.now(),
      type: type,
      content: content,
      timestamp: options.timestamp || new Date().toISOString(),
      confidence: options.confidence,
      sources: options.sources || [],
      isError: options.isError || false,
      isWelcome: options.isWelcome || false
    };
  }

  // Health check for the API
  async healthCheck() {
    try {
      // In development, just check if we can reach the proxy server
      if (process.env.NODE_ENV === 'development') {
        const response = await fetch('http://localhost:3001/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question: 'health check' })
        });
        return response.status !== 404; // Proxy server is running if we get any response
      } else {
        const response = await fetch(this.apiUrl.replace('/search', '/health'), {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
          }
        });
        return response.ok;
      }
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Get API status and information
  getApiInfo() {
    return {
      apiUrl: this.apiUrl,
      environment: process.env.NODE_ENV,
      usingProxy: process.env.NODE_ENV === 'development',
      historyLength: this.conversationHistory.length,
      lastActivity: this.conversationHistory.length > 0 
        ? this.conversationHistory[this.conversationHistory.length - 1].timestamp 
        : null
    };
  }
}

export default new ChatService();