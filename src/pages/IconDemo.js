import React, { useState } from 'react';
import AIIcon from '../components/AIIcon';
import MinimalAIIcon from '../components/MinimalAIIcon';
import SimpleAIIcon from '../components/SimpleAIIcon';
import { MessageCircle, Bot } from 'lucide-react';

const IconDemo = () => {
  const [selectedIcon, setSelectedIcon] = useState('minimal');

  const iconVariants = [
    {
      id: 'original',
      name: 'Original MessageCircle',
      component: <MessageCircle size={48} />,
      description: 'Default Lucide React icon'
    },
    {
      id: 'bot',
      name: 'Bot Icon',
      component: <Bot size={48} />,
      description: 'Alternative Lucide React icon'
    },
    {
      id: 'detailed',
      name: 'Detailed AI Icon',
      component: <AIIcon size={48} />,
      description: 'Neural network pattern with connections'
    },
    {
      id: 'minimal',
      name: 'Minimal AI Icon',
      component: <MinimalAIIcon size={48} />,
      description: 'Three connected nodes (recommended)'
    },
    {
      id: 'simple',
      name: 'Simple AI Icon',
      component: <SimpleAIIcon size={48} />,
      description: 'Hexagon with center dot'
    }
  ];

  const IconPreview = ({ icon, isSelected, onClick }) => (
    <div 
      onClick={onClick}
      style={{
        padding: '20px',
        border: isSelected ? '2px solid #667eea' : '2px solid #e2e8f0',
        borderRadius: '12px',
        cursor: 'pointer',
        textAlign: 'center',
        background: isSelected ? '#f0f4ff' : 'white',
        transition: 'all 0.2s ease',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)'
      }}
    >
      <div style={{ 
        color: isSelected ? '#667eea' : '#64748b',
        marginBottom: '12px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        {icon.component}
      </div>
      <h4 style={{ 
        margin: '0 0 8px 0', 
        fontSize: '14px',
        color: isSelected ? '#667eea' : '#334155'
      }}>
        {icon.name}
      </h4>
      <p style={{ 
        margin: 0, 
        fontSize: '12px', 
        color: '#64748b',
        lineHeight: '1.4'
      }}>
        {icon.description}
      </p>
    </div>
  );

  const ChatButtonPreview = ({ icon }) => (
    <div style={{
      position: 'relative',
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
      margin: '0 auto'
    }}>
      {icon.component}
      <span style={{
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        background: '#ef4444',
        color: 'white',
        fontSize: '10px',
        fontWeight: '600',
        padding: '2px 6px',
        borderRadius: '10px',
        border: '2px solid white'
      }}>
        AI
      </span>
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '16px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>
          AI Chat Icon Design
        </h1>
        <p style={{ margin: 0, opacity: 0.9 }}>
          เลือกไอคอน AI ที่คุณชอบสำหรับ Chat Bot
        </p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '20px', color: '#334155' }}>เลือกไอคอน:</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px' 
        }}>
          {iconVariants.map((icon) => (
            <IconPreview
              key={icon.id}
              icon={icon}
              isSelected={selectedIcon === icon.id}
              onClick={() => setSelectedIcon(icon.id)}
            />
          ))}
        </div>
      </div>

      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#334155' }}>
          ตัวอย่างปุ่ม Chat Bot
        </h3>
        <ChatButtonPreview 
          icon={iconVariants.find(i => i.id === selectedIcon)} 
        />
        <p style={{ 
          marginTop: '15px', 
          fontSize: '14px', 
          color: '#64748b' 
        }}>
          {iconVariants.find(i => i.id === selectedIcon)?.description}
        </p>
      </div>

      <div style={{ 
        background: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '12px', 
        marginTop: '20px',
        border: '1px solid #e2e8f0'
      }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#334155' }}>
          💡 คำแนะนำการเลือกไอคอน:
        </h4>
        <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
          <p><strong>Minimal AI Icon:</strong> เหมาะสำหรับการใช้งานทั่วไป มีความเรียบง่ายและชัดเจน</p>
          <p><strong>Detailed AI Icon:</strong> เหมาะสำหรับแอปที่เน้น AI และเทคโนโลยี</p>
          <p><strong>Simple AI Icon:</strong> เหมาะสำหรับดีไซน์ที่เน้นความเรียบง่าย</p>
          <p><strong>Bot Icon:</strong> เป็นมาตรฐานและคุ้นเคยสำหรับผู้ใช้</p>
        </div>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        background: '#dbeafe', 
        borderRadius: '8px',
        border: '1px solid #3b82f6'
      }}>
        <p style={{ 
          margin: 0, 
          fontSize: '13px', 
          color: '#1e40af' 
        }}>
          <strong>การใช้งาน:</strong> ไอคอนที่เลือกจะถูกใช้ในปุ่ม Chat Bot ที่มุมล่างขวาของหน้าเว็บ
        </p>
      </div>
    </div>
  );
};

export default IconDemo;