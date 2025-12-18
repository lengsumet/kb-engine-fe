import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Minimize2, Maximize2, Bot, User, Sparkles, RefreshCw, Copy, Trash2 } from 'lucide-react';
import ChatIcon from './ChatIcon';
import chatService from '../services/chatService';
import './InteractiveChat.css';

const InteractiveChat = ({ isOpen, onToggle, initialQuery = '' }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [apiStatus, setApiStatus] = useState('unknown');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Initialize with welcome message and check API status
    if (messages.length === 0) {
      const welcomeMessage = chatService.formatChatMessage(
        'สวัสดีครับ! ผมเป็น AI Assistant ที่จะช่วยคุณค้นหาข้อมูลและตอบคำถามต่างๆ\n\nคุณสามารถถามเกี่ยวกับ:\n• นโยบายบริษัท\n• ขั้นตอนการทำงาน\n• คู่มือการใช้งาน\n• กฎระเบียบต่างๆ\n\nมีอะไรให้ช่วยไหมครับ?',
        'bot',
        {
          id: 1,
          timestamp: new Date().toISOString(),
          isWelcome: true
        }
      );
      
      setMessages([welcomeMessage]);
      setSuggestedQuestions(chatService.getSuggestedQuestions().slice(0, 4));
      
      // Check API health
      checkApiHealth();
    }
  }, [messages.length]);

  const checkApiHealth = async () => {
    try {
      const isHealthy = await chatService.healthCheck();
      setApiStatus(isHealthy ? 'connected' : 'disconnected');
    } catch (error) {
      setApiStatus('disconnected');
    }
  };

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

    const userMessage = chatService.formatChatMessage(messageText.trim(), 'user', {
      id: Date.now()
    });

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call the chat API using the new chatService
      const response = await chatService.sendMessage(messageText.trim(), true);
      
      const botMessage = chatService.formatChatMessage(response.answer, 'bot', {
        id: response.messageId,
        confidence: response.confidence,
        sources: response.sources,
        timestamp: response.timestamp
      });

      setMessages(prev => [...prev, botMessage]);

      // Generate follow-up questions
      const followUps = chatService.generateFollowUpQuestions(response);
      setSuggestedQuestions(followUps);

    } catch (error) {
      console.error('Error generating AI response:', error);
      
      const errorMessage = chatService.formatChatMessage(
        `ขออภัยครับ เกิดข้อผิดพลาดในการประมวลผล: ${error.message}\n\nกรุณาลองใหม่อีกครั้ง หรือติดต่อผู้ดูแลระบบ`,
        'bot',
        {
          id: Date.now() + 1,
          isError: true
        }
      );

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('คุณต้องการล้างประวัติการสนทนาทั้งหมดหรือไม่?')) {
      chatService.clearHistory();
      const welcomeMessage = chatService.formatChatMessage(
        'ประวัติการสนทนาถูกล้างเรียบร้อยแล้ว\n\nคุณสามารถเริ่มถามคำถามใหม่ได้เลย',
        'bot',
        {
          id: 1,
          isWelcome: true
        }
      );
      setMessages([welcomeMessage]);
      setSuggestedQuestions(chatService.getSuggestedQuestions().slice(0, 4));
    }
  };

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
    // Could add a toast notification here
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
        <ChatIcon size={28} />
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
          <div className={`api-status ${apiStatus}`}>
            {apiStatus === 'connected' ? 'เชื่อมต่อแล้ว' : 
             apiStatus === 'disconnected' ? 'ไม่เชื่อมต่อ' : 'กำลังตรวจสอบ'}
          </div>
        </div>
        <div className="chat-controls">
          <button 
            onClick={handleClearChat}
            className="chat-control-btn"
            title="ล้างประวัติ"
          >
            <Trash2 size={16} />
          </button>
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="chat-control-btn"
            title={isMinimized ? 'ขยาย' : 'ย่อ'}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button onClick={onToggle} className="chat-control-btn" title="ปิด">
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type} ${message.isError ? 'error' : ''} ${message.isWelcome ? 'welcome' : ''}`}>
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
                    {message.sources && message.sources.length > 0 && (
                      <div className="message-sources">
                        <small>แหล่งข้อมูล: {message.sources.join(', ')}</small>
                      </div>
                    )}
                  </div>
                  <div className="message-actions">
                    <button 
                      onClick={() => handleCopyMessage(message.content)}
                      className="message-action-btn"
                      title="คัดลอก"
                    >
                      <Copy size={12} />
                    </button>
                    <span className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString('th-TH', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Show suggested questions after the last bot message */}
            {suggestedQuestions.length > 0 && !isTyping && (
              <div className="suggested-questions-container">
                <div className="suggestions-header">คำถามที่แนะนำ:</div>
                <div className="suggestions-grid">
                  {suggestedQuestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="suggestion-chip"
                      disabled={isTyping}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
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