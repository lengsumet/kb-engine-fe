import React, { useState } from 'react';
import InteractiveChat from '../components/InteractiveChat';
import chatService from '../services/chatService';
import { MessageSquare, Settings, Info, Zap } from 'lucide-react';

const ChatTestPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [apiInfo, setApiInfo] = useState(null);

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleGetApiInfo = () => {
    const info = chatService.getApiInfo();
    setApiInfo(info);
  };

  const testQuestions = [
    'สวัสดี',
    'นโยบายการลาพักร้อน',
    'ขั้นตอนการอนุมัติสินเชื่อ',
    'วิธีแก้ไขปัญหาระบบ IT',
    'วันหยุดประจำปี 2568-2569',
    'การขอใบรับรองเงินเดือน'
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '16px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>
          <MessageSquare size={32} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
          AI Chat Bot Test Page
        </h1>
        <p style={{ margin: 0, opacity: 0.9 }}>
          ทดสอบการทำงานของ AI Chat Bot ที่เชื่อมต่อกับ REACT_APP_SEARCH_API_URL
        </p>
        {process.env.NODE_ENV === 'development' && (
          <div style={{ 
            marginTop: '15px', 
            padding: '10px', 
            background: 'rgba(255, 255, 255, 0.2)', 
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            💡 <strong>Development Mode:</strong> ใช้คำสั่ง <code style={{ background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '4px' }}>npm run dev</code> เพื่อเริ่ม proxy server
          </div>
        )}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '12px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={20} />
            การตั้งค่า API
          </h3>
          <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
            <p><strong>API URL:</strong></p>
            <code style={{ 
              background: '#f1f5f9', 
              padding: '8px', 
              borderRadius: '6px', 
              display: 'block',
              fontSize: '12px',
              wordBreak: 'break-all'
            }}>
              {process.env.REACT_APP_SEARCH_API_URL || 'ไม่ได้กำหนด'}
            </code>
            
            <button 
              onClick={handleGetApiInfo}
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                marginTop: '10px'
              }}
            >
              ตรวจสอบสถานะ API
            </button>

            {apiInfo && (
              <div style={{ 
                marginTop: '10px', 
                padding: '10px', 
                background: apiInfo.usingProxy ? '#f0f9ff' : '#f8f9fa', 
                borderRadius: '6px',
                fontSize: '12px',
                border: apiInfo.usingProxy ? '1px solid #0ea5e9' : '1px solid #e5e7eb'
              }}>
                <div><strong>Environment:</strong> {apiInfo.environment}</div>
                <div><strong>Using Proxy:</strong> {apiInfo.usingProxy ? 'Yes (Development)' : 'No (Production)'}</div>
                <div><strong>URL:</strong> {apiInfo.apiUrl}</div>
                <div><strong>ประวัติการสนทนา:</strong> {apiInfo.historyLength} รายการ</div>
                <div><strong>กิจกรรมล่าสุด:</strong> {apiInfo.lastActivity || 'ไม่มี'}</div>
                {apiInfo.usingProxy && (
                  <div style={{ 
                    marginTop: '8px', 
                    padding: '6px', 
                    background: '#dbeafe', 
                    borderRadius: '4px',
                    fontSize: '11px',
                    color: '#1e40af'
                  }}>
                    💡 ใช้ Proxy Server เพื่อแก้ปัญหา CORS ใน Development
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '12px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={20} />
            การทดสอบ
          </h3>
          <div style={{ fontSize: '14px', color: '#64748b' }}>
            <p>คลิกปุ่มด้านล่างเพื่อเปิด Chat Bot และทดสอบการทำงาน:</p>
            
            <button 
              onClick={handleToggleChat}
              style={{
                background: isChatOpen ? '#dc2626' : '#059669',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '15px',
                width: '100%'
              }}
            >
              {isChatOpen ? 'ปิด Chat Bot' : 'เปิด Chat Bot'}
            </button>

            <p style={{ fontSize: '13px', margin: '10px 0' }}>คำถามตัวอย่างสำหรับทดสอบ:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {testQuestions.map((question, index) => (
                <div key={index} style={{ 
                  background: '#f1f5f9', 
                  padding: '6px 10px', 
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#475569'
                }}>
                  • {question}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={20} />
          คุณสมบัติของ Chat Bot
        </h3>
        <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <div>
              <h4 style={{ margin: '0 0 8px 0', color: '#334155', fontSize: '14px' }}>🤖 AI Integration</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px' }}>
                <li>เชื่อมต่อกับ REACT_APP_SEARCH_API_URL</li>
                <li>ตอบคำถามแบบ Real-time</li>
                <li>แสดงระดับความมั่นใจ</li>
                <li>บันทึกประวัติการสนทนา</li>
              </ul>
            </div>
            <div>
              <h4 style={{ margin: '0 0 8px 0', color: '#334155', fontSize: '14px' }}>💬 Chat Features</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px' }}>
                <li>คำถามแนะนำอัตโนมัติ</li>
                <li>คัดลอกข้อความ</li>
                <li>ล้างประวัติการสนทนา</li>
                <li>แสดงสถานะการเชื่อมต่อ</li>
              </ul>
            </div>
            <div>
              <h4 style={{ margin: '0 0 8px 0', color: '#334155', fontSize: '14px' }}>🎨 UI/UX</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px' }}>
                <li>Responsive Design</li>
                <li>Dark Mode Support</li>
                <li>Smooth Animations</li>
                <li>Mobile Friendly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Chat Component */}
      <InteractiveChat isOpen={isChatOpen} onToggle={handleToggleChat} />
    </div>
  );
};

export default ChatTestPage;