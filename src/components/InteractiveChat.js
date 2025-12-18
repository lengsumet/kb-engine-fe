import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Minimize2, Maximize2, Bot, User, Sparkles } from 'lucide-react';
import { generateAIAnswer, sendAIFeedback } from '../services/aiService';
import './InteractiveChat.css';

const InteractiveChat = ({ isOpen, onToggle, initialQuery = '' }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          type: 'bot',
          content: 'สวัสดีครับ! ผมเป็น AI Assistant ที่จะช่วยคุณค้นหาข้อมูลและตอบคำถามต่างๆ\n\nคุณสามารถถามเกี่ยวกับ:\n• นโยบายบริษัท\n• ขั้นตอนการทำงาน\n• คู่มือการใช้งาน\n• กฎระเบียบต่างๆ\n\nมีอะไรให้ช่วยไหมครับ?',
          timestamp: new Date(),
          suggestions: [
            'นโยบายการลาพักร้อน',
            'ขั้นตอนการอนุมัติสินเชื่อ',
            'วิธีแก้ไขปัญหาระบบ IT',
            'วันหยุดประจำปี 2024'
          ]
        }
      ]);
    }
  }, [messages.length]);

  useEffect(() => {
    // Handle initial query from search
    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus input when chat opens
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate AI response
      const aiResponse = await generateAIResponse(messageText.trim());
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: aiResponse.content,
        timestamp: new Date(),
        confidence: aiResponse.confidence,
        sources: aiResponse.sources,
        suggestions: aiResponse.suggestions
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'ขออภัยครับ เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้ง',
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateAIResponse = async (query) => {
    try {
      // Try to use actual AI service
      const response = await generateAIAnswer(query, []);
      return {
        content: response.text,
        confidence: response.confidence,
        sources: response.sources,
        suggestions: generateFollowUpQuestions(query)
      };
    } catch (error) {
      // Fallback to mock responses
      return generateMockResponse(query);
    }
  };

  const generateMockResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('สวัสดี') || lowerQuery.includes('หวัดดี')) {
      return {
        content: 'สวัสดีครับ! ยินดีที่ได้รู้จัก มีอะไรให้ช่วยเหลือไหมครับ?',
        confidence: 0.95,
        suggestions: ['นโยบายการลา', 'ขั้นตอนการอนุมัติ', 'คู่มือการใช้งาน']
      };
    } else if (lowerQuery.includes('ลา') || lowerQuery.includes('พักร้อน')) {
      return {
        content: 'เรื่องการลาพักร้อนนะครับ ตามนโยบายบริษัท:\n\n📋 **สิทธิการลา:**\n• ทำงานครบ 1 ปี: 6 วัน\n• ทำงานครบ 3 ปี: 10 วัน\n• ทำงานครบ 5 ปี: 15 วัน\n\n📝 **ขั้นตอน:**\n1. ยื่นคำขอล่วงหน้า 7 วัน\n2. กรอกแบบฟอร์มคำขอ\n3. รอการอนุมัติจากหัวหน้า\n\nต้องการรายละเอียดเพิ่มเติมไหมครับ?',
        confidence: 0.92,
        suggestions: ['แบบฟอร์มคำขอลา', 'การลาป่วย', 'วันลาสะสม']
      };
    } else if (lowerQuery.includes('สินเชื่อ') || lowerQuery.includes('อนุมัติ')) {
      return {
        content: '💳 **ขั้นตอนการอนุมัติสินเชื่อ:**\n\n1️⃣ **ตรวจสอบเอกสาร**\n• เอกสารประกอบการพิจารณา\n• ยืนยันตัวตนลูกค้า\n\n2️⃣ **ประเมินความเสี่ยง**\n• วิเคราะห์รายได้-หนี้สิน\n• ตรวจสอบเครดิตประวัติ\n\n3️⃣ **การอนุมัติ**\n• < 500K: หัวหน้าสาขา\n• 500K-2M: ผู้จัดการภูมิภาค\n• > 2M: คณะกรรมการ\n\n⏱️ **ระยะเวลา:** 3-5 วันทำการ',
        confidence: 0.89,
        suggestions: ['เอกสารประกอบ', 'อัตราดอกเบี้ย', 'เงื่อนไขการอนุมัติ']
      };
    } else if (lowerQuery.includes('it') || lowerQuery.includes('ระบบ') || lowerQuery.includes('คอมพิวเตอร์')) {
      return {
        content: '💻 **การแก้ไขปัญหาระบบ IT:**\n\n🔧 **ปัญหาที่พบบ่อย:**\n• ไม่สามารถเข้าระบบ → รีเซ็ตรหัsผ่าน\n• ระบบช้า → ปิดโปรแกรมที่ไม่ใช้\n• เครือข่ายขัดข้อง → ตรวจสอบสาย LAN\n\n📞 **ติดต่อ IT Support:**\n• โทร: ext. 1234\n• Email: itsupport@company.com\n• Line: @itsupport\n\nต้องการความช่วยเหลือเรื่องอะไรเฉพาะเจาะจงไหมครับ?',
        confidence: 0.87,
        suggestions: ['รีเซ็ตรหัสผ่าน', 'ปัญหาเครือข่าย', 'ติดต่อ IT Support']
      };
    } else {
      return {
        content: `ขอบคุณสำหรับคำถาม "${query}" ครับ\n\nผมจะช่วยค้นหาข้อมูลที่เกี่ยวข้องให้คุณ กรุณารอสักครู่นะครับ...\n\nหรือคุณสามารถเลือกหัวข้อที่สนใจจากด้านล่างได้เลยครับ`,
        confidence: 0.75,
        suggestions: ['นโยบาย HR', 'ขั้นตอนการทำงาน', 'คู่มือการใช้งาน', 'กฎระเบียบ']
      };
    }
  };

  const generateFollowUpQuestions = (query) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('ลา')) {
      return ['แบบฟอร์มคำขอลา', 'การลาป่วย', 'วันลาสะสม'];
    } else if (lowerQuery.includes('สินเชื่อ')) {
      return ['เอกสารประกอบ', 'อัตราดอกเบี้ย', 'เงื่อนไขการอนุมัติ'];
    } else if (lowerQuery.includes('it')) {
      return ['รีเซ็ตรหัสผ่าน', 'ปัญหาเครือข่าย', 'ติดต่อ IT Support'];
    } else {
      return ['นโยบาย HR', 'ขั้นตอนการทำงาน', 'คู่มือการใช้งาน'];
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageContent = (content) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={index} className="message-heading">{line.replace(/\*\*/g, '')}</div>;
      } else if (line.startsWith('• ')) {
        return <div key={index} className="message-bullet">{line}</div>;
      } else if (line.match(/^\d+\./)) {
        return <div key={index} className="message-numbered">{line}</div>;
      } else if (line.trim() === '') {
        return <br key={index} />;
      } else {
        return <div key={index} className="message-text">{line}</div>;
      }
    });
  };

  if (!isOpen) {
    return (
      <button onClick={onToggle} className="chat-toggle-btn">
        <MessageCircle size={24} />
        <span className="chat-badge">AI</span>
      </button>
    );
  }

  return (
    <div className={`interactive-chat ${isMinimized ? 'minimized' : ''}`}>
      <div className="chat-header">
        <div className="chat-title">
          <Bot size={20} />
          <span>AI Assistant</span>
          <div className="online-indicator"></div>
        </div>
        <div className="chat-controls">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="chat-control-btn"
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button onClick={onToggle} className="chat-control-btn">
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-avatar">
                  {message.type === 'bot' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className="message-content">
                  <div className="message-bubble">
                    {formatMessageContent(message.content)}
                    {message.confidence && (
                      <div className="message-confidence">
                        <Sparkles size={12} />
                        <span>ความมั่นใจ: {Math.round(message.confidence * 100)}%</span>
                      </div>
                    )}
                  </div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString('th-TH', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="message-suggestions">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="suggestion-chip"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-avatar">
                  <Bot size={16} />
                </div>
                <div className="message-content">
                  <div className="message-bubble typing">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <div className="input-container">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="พิมพ์คำถามของคุณ..."
                className="message-input"
                rows="1"
              />
              <button 
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isTyping}
                className="send-btn"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InteractiveChat;