import React, { useState, useEffect } from 'react';
import { HelpCircle, ArrowRight } from 'lucide-react';
import './RelatedQuestions.css';

const RelatedQuestions = ({ query, onQuestionSelect }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      loadRelatedQuestions();
    }
  }, [query]);

  const loadRelatedQuestions = async () => {
    setLoading(true);
    try {
      // Mock related questions - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockQuestions = generateMockQuestions(query);
      setQuestions(mockQuestions);
    } catch (error) {
      console.error('Error loading related questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockQuestions = (searchQuery) => {
    const lowerQuery = searchQuery.toLowerCase();
    
    if (lowerQuery.includes('ลา') || lowerQuery.includes('พักร้อน')) {
      return [
        'วิธีการขอลาป่วยฉุกเฉินต้องทำอย่างไร?',
        'สามารถลาพักร้อนแบบครึ่งวันได้หรือไม่?',
        'การลาคลอดมีสิทธิ์กี่วัน?',
        'ถ้าลาพักร้อนแล้วต้องมาทำงานด่วนจะเป็นอย่างไร?',
        'วันลาที่เหลือจากปีที่แล้วจะหมดอายุเมื่อไหร่?'
      ];
    } else if (lowerQuery.includes('สินเชื่อ') || lowerQuery.includes('อนุมัติ')) {
      return [
        'เอกสารที่ต้องใช้ในการขอสินเชื่อมีอะไรบ้าง?',
        'ระยะเวลาการพิจารณาสินเชื่อนานแค่ไหน?',
        'อัตราดอกเบี้ยสินเชื่อปัจจุบันเท่าไหร่?',
        'สามารถขอสินเชื่อเพิ่มเติมได้หรือไม่?',
        'หากลูกค้าผิดนัดชำระจะมีขั้นตอนอย่างไร?'
      ];
    } else if (lowerQuery.includes('วันหยุด')) {
      return [
        'วันหยุดชดเชยจะประกาศเมื่อไหร่?',
        'วันหยุดพิเศษมีเกณฑ์การกำหนดอย่างไร?',
        'หากวันหยุดตรงกับวันเสาร์-อาทิตย์จะเป็นอย่างไร?',
        'พนักงานต่างชาติมีสิทธิ์วันหยุดเหมือนกันหรือไม่?',
        'การทำงานในวันหยุดจะได้ค่าตอบแทนพิเศษหรือไม่?'
      ];
    } else if (lowerQuery.includes('it') || lowerQuery.includes('ระบบ')) {
      return [
        'วิธีการรีเซ็ตรหัสผ่านระบบทำอย่างไร?',
        'ระบบล่มต้องแจ้งใครก่อน?',
        'การขอสิทธิ์เข้าใช้ระบบใหม่ต้องทำอย่างไร?',
        'ข้อมูลสำรองระบบจะเก็บไว้นานแค่ไหน?',
        'การใช้งาน VPN ต้องขออนุมัติหรือไม่?'
      ];
    } else {
      return [
        'มีข้อมูลอะไรเพิ่มเติมเกี่ยวกับเรื่องนี้บ้าง?',
        'นโยบายล่าสุดเกี่ยวกับเรื่องนี้คืออะไร?',
        'ขั้นตอนการดำเนินการเป็นอย่างไร?',
        'ใครเป็นผู้รับผิดชอบเรื่องนี้?',
        'มีแบบฟอร์มหรือเอกสารที่เกี่ยวข้องหรือไม่?'
      ];
    }
  };

  const handleQuestionClick = (question) => {
    if (onQuestionSelect) {
      onQuestionSelect(question);
    }
  };

  if (!query || questions.length === 0) {
    return null;
  }

  return (
    <div className="related-questions">
      <div className="questions-header">
        <HelpCircle size={20} />
        <h3>คำถามที่เกี่ยวข้อง</h3>
      </div>
      
      {loading ? (
        <div className="questions-loading">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>กำลังค้นหาคำถามที่เกี่ยวข้อง...</p>
        </div>
      ) : (
        <div className="questions-list">
          {questions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuestionClick(question)}
              className="question-item"
            >
              <span className="question-text">{question}</span>
              <ArrowRight size={16} className="question-arrow" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedQuestions;