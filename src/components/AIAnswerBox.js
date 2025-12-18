import React, { useState, useEffect } from 'react';
import { Sparkles, ThumbsUp, ThumbsDown, Copy, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { generateAIAnswer, sendAIFeedback } from '../services/aiService';
import './AIAnswerBox.css';

const AIAnswerBox = ({ query, searchResults, loading }) => {
  const [answer, setAnswer] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [sources, setSources] = useState([]);

  useEffect(() => {
    if (query && searchResults && searchResults.length > 0) {
      generateAnswer();
    }
  }, [query, searchResults]);

  const generateAnswer = async () => {
    setGenerating(true);
    try {
      // Try to use actual AI service first
      try {
        const aiResponse = await generateAIAnswer(query, searchResults);
        setAnswer(aiResponse);
        
        // Extract sources from AI response or search results
        const aiSources = aiResponse.sources || searchResults.slice(0, 3).map(result => ({
          id: result.id,
          title: result.title,
          category: result.category,
          relevanceScore: result.relevanceScore
        }));
        setSources(aiSources);
      } catch (apiError) {
        console.log('AI API not available, using mock data');
        // Fallback to mock answer if API is not available
        const mockAnswer = generateMockAnswer(query, searchResults);
        setAnswer(mockAnswer);
        
        // Extract sources from search results
        const topSources = searchResults.slice(0, 3).map(result => ({
          id: result.id,
          title: result.title,
          category: result.category,
          relevanceScore: result.relevanceScore
        }));
        setSources(topSources);
      }
    } catch (error) {
      console.error('Error generating answer:', error);
      setAnswer({
        text: 'ขออภัย ไม่สามารถสร้างคำตอบได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง',
        confidence: 0,
        type: 'error'
      });
    } finally {
      setGenerating(false);
    }
  };

  const generateMockAnswer = (query, results) => {
    // Mock AI answer generation based on query patterns
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('ลา') || lowerQuery.includes('พักร้อน')) {
      return {
        text: `ตามนโยบายการลาพักร้อนของบริษัท พนักงานมีสิทธิ์ลาพักร้อนดังนี้:

**สิทธิการลาตามอายุงาน:**
- พนักงานที่ทำงานครบ 1 ปี: 6 วัน
- พนักงานที่ทำงานครบ 3 ปี: 10 วัน
- พนักงานที่ทำงานครบ 5 ปี: 15 วัน
- พนักงานที่ทำงานครบ 10 ปี: 20 วัน

**ขั้นตอนการขออนุมัติ:**
1. ยื่นคำขอล่วงหน้าอย่างน้อย 7 วัน
2. กรอกแบบฟอร์มคำขอลาพักร้อน
3. ส่งให้หัวหน้างานพิจารณาอนุมัติ

**ข้อควรระวัง:**
- ไม่สามารถลาพักร้อนในช่วงปิดบัญชีประจำเดือน
- ต้องจัดให้มีคนทำงานแทนในช่วงที่ลา
- วันลาที่ไม่ได้ใช้สามารถสะสมได้ไม่เกิน 30 วัน`,
        confidence: 0.95,
        type: 'detailed'
      };
    } else if (lowerQuery.includes('สินเชื่อ') || lowerQuery.includes('อนุมัติ')) {
      return {
        text: `ขั้นตอนการอนุมัติสินเชื่อมีดังนี้:

**1. การตรวจสอบเอกสาร**
- ตรวจสอบความครบถ้วนของเอกสาร
- ยืนยันตัวตนของลูกค้า
- ตรวจสอบประวัติเครดิต

**2. การประเมินความเสี่ยง**
- วิเคราะห์รายได้และหนี้สิน
- ประเมินความสามารถในการชำระหนี้
- พิจารณาหลักประกัน

**3. การอนุมัติ**
- วงเงินต่ำกว่า 500,000 บาท: หัวหน้าสาขาอนุมัติ
- วงเงิน 500,000 - 2,000,000 บาท: ผู้จัดการภูมิภาคอนุมัติ
- วงเงินเกิน 2,000,000 บาท: คณะกรรมการสินเชื่ออนุมัติ

**ระยะเวลาการพิจารณา:** 3-5 วันทำการ`,
        confidence: 0.92,
        type: 'detailed'
      };
    } else if (lowerQuery.includes('วันหยุด')) {
      return {
        text: `วันหยุดประจำปี 2568-2569 มีการเปลี่ยนแปลงดังนี้:

**วันหยุดที่เพิ่มขึ้น:**
- วันหยุดพิเศษเฉลิมพระชนมพรรษา (28 กรกฎาคม 2569)
- วันหยุดสงกรานต์เพิ่มเป็น 4 วัน (13-16 เมษายน 2569)

**วันหยุดที่ยกเลิก:**
- วันหยุดชดเชยโควิด-19 (ยกเลิกในปี 2569)

**วันหยุดที่ไม่เปลี่ยนแปลง:**
- วันปีใหม่ (1 มกราคม)
- วันสงกรานต์ (13-15 เมษายน)
- วันแรงงาน (1 พฤษภาคม)

รวมวันหยุดทั้งปี 2569: 18 วัน`,
        confidence: 0.98,
        type: 'detailed'
      };
    } else if (lowerQuery.includes('it') || lowerQuery.includes('แก้ไข') || lowerQuery.includes('ปัญหา')) {
      return {
        text: `วิธีการแก้ไขปัญหาระบบ IT เบื้องต้น:

**ปัญหาที่พบบ่อย:**

1. **ไม่สามารถเข้าระบบได้**
   - ตรวจสอบ Username และ Password
   - ลองรีเซ็ตรหัสผ่านผ่านระบบ
   - ติดต่อ IT Support: ext. 1234

2. **ระบบช้า**
   - ปิดโปรแกรมที่ไม่ใช้งาน
   - ล้าง Cache ของ Browser
   - รีสตาร์ทคอมพิวเตอร์

3. **เครือข่ายขัดข้อง**
   - ตรวจสอบสาย LAN
   - ลองเชื่อมต่อ WiFi ใหม่
   - แจ้ง IT Support หากปัญหายังไม่หาย

**ติดต่อ IT Support:**
- โทร: ext. 1234
- Email: itsupport@company.com
- Line: @itsupport`,
        confidence: 0.89,
        type: 'detailed'
      };
    } else {
      return {
        text: `จากการค้นหาคำว่า "${query}" พบข้อมูลที่เกี่ยวข้อง ${results.length} รายการ

ข้อมูลหลักที่พบ:
${results.slice(0, 3).map((r, i) => `${i + 1}. ${r.title}`).join('\n')}

คุณสามารถดูรายละเอียดเพิ่มเติมได้จากเอกสารด้านล่าง หรือปรับคำค้นหาให้ชัดเจนขึ้นเพื่อผลลัพธ์ที่ดีกว่า`,
        confidence: 0.75,
        type: 'summary'
      };
    }
  };

  const handleCopyAnswer = () => {
    if (answer) {
      navigator.clipboard.writeText(answer.text);
      alert('คัดลอกคำตอบเรียบร้อยแล้ว');
    }
  };

  const handleFeedback = async (type) => {
    setFeedback(type);
    
    // Send feedback to backend
    try {
      await sendAIFeedback(query, answer.text, type);
      console.log(`Feedback sent: ${type} for query: ${query}`);
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };

  const handleRegenerate = () => {
    setAnswer(null);
    setFeedback(null);
    generateAnswer();
  };

  if (loading || generating) {
    return (
      <div className="ai-answer-box loading">
        <div className="answer-header">
          <div className="ai-badge">
            <Sparkles size={16} />
            <span>AI กำลังสร้างคำตอบ...</span>
          </div>
        </div>
        <div className="answer-loading">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>กำลังวิเคราะห์เอกสารและสร้างคำตอบที่เหมาะสม</p>
        </div>
      </div>
    );
  }

  if (!answer) {
    return null;
  }

  return (
    <div className="ai-answer-box">
      <div className="answer-header">
        <div className="header-left">
          <div className="ai-badge">
            <Sparkles size={16} />
            <span>คำตอบจาก AI</span>
          </div>
          <div className="confidence-badge" data-confidence={answer.confidence >= 0.9 ? 'high' : answer.confidence >= 0.7 ? 'medium' : 'low'}>
            ความมั่นใจ: {Math.round(answer.confidence * 100)}%
          </div>
        </div>
        <div className="header-actions">
          <button onClick={handleCopyAnswer} className="action-btn" title="คัดลอก">
            <Copy size={16} />
          </button>
          <button onClick={handleRegenerate} className="action-btn" title="สร้างใหม่">
            <RefreshCw size={16} />
          </button>
          <button onClick={() => setExpanded(!expanded)} className="action-btn" title={expanded ? 'ย่อ' : 'ขยาย'}>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {expanded && (
        <>
          <div className="answer-content">
            <div className="answer-text">
              {answer.text.split('\n').map((line, index) => {
                // Format markdown-style text
                if (line.startsWith('**') && line.endsWith('**')) {
                  return <h4 key={index}>{line.replace(/\*\*/g, '')}</h4>;
                } else if (line.startsWith('- ')) {
                  return <li key={index}>{line.substring(2)}</li>;
                } else if (line.match(/^\d+\./)) {
                  return <li key={index} className="numbered">{line}</li>;
                } else if (line.trim() === '') {
                  return <br key={index} />;
                } else {
                  return <p key={index}>{line}</p>;
                }
              })}
            </div>
          </div>

          {sources.length > 0 && (
            <div className="answer-sources">
              <h4>แหล่งข้อมูลอ้างอิง:</h4>
              <div className="sources-list">
                {sources.map((source, index) => (
                  <div key={source.id} className="source-item">
                    <span className="source-number">{index + 1}</span>
                    <div className="source-info">
                      <span className="source-title">{source.title}</span>
                      <span className="source-relevance">
                        ความเกี่ยวข้อง: {Math.round(source.relevanceScore * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="answer-footer">
            <div className="feedback-section">
              <span className="feedback-label">คำตอบนี้เป็นประโยชน์หรือไม่?</span>
              <div className="feedback-buttons">
                <button
                  onClick={() => handleFeedback('positive')}
                  className={`feedback-btn ${feedback === 'positive' ? 'active' : ''}`}
                  disabled={feedback !== null}
                >
                  <ThumbsUp size={16} />
                  <span>เป็นประโยชน์</span>
                </button>
                <button
                  onClick={() => handleFeedback('negative')}
                  className={`feedback-btn ${feedback === 'negative' ? 'active' : ''}`}
                  disabled={feedback !== null}
                >
                  <ThumbsDown size={16} />
                  <span>ไม่เป็นประโยชน์</span>
                </button>
              </div>
            </div>
            {feedback && (
              <div className="feedback-thanks">
                ขอบคุณสำหรับความคิดเห็น! เราจะนำไปปรับปรุงระบบให้ดีขึ้น
              </div>
            )}
          </div>

          <div className="answer-disclaimer">
            <p>
              ⚠️ คำตอบนี้สร้างโดย AI จากการวิเคราะห์เอกสารในระบบ 
              กรุณาตรวจสอบข้อมูลจากเอกสารต้นฉบับเพื่อความแม่นยำ
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default AIAnswerBox;