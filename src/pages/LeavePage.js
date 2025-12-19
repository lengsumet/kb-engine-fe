import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import './LeavePage.css';

const LeavePage = () => {
  const { id } = useParams();
  const [leaveData, setLeaveData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockLeaveData = {
          id: parseInt(id),
          title: 'นโยบายการลาพักร้อนประจำปี 2024',
          summary: 'นโยบายการลาพักร้อนที่อัปเดตใหม่ ครอบคลุมสิทธิการลา ขั้นตอนการขอลา และเงื่อนไขต่างๆ',
          category: 'hr',
          lastUpdated: '2024-01-15T10:30:00',
          author: 'ฝ่ายทรัพยากรบุคคล',
          version: '2.1',
          tags: ['นโยบาย', 'การลา', 'HR'],
          leaveTypes: [
            {
              type: 'พักร้อน',
              days: 6,
              description: 'วันลาพักร้อนประจำปี',
              conditions: ['ต้องแจ้งล่วงหน้า 3 วัน', 'ไม่สามารถสะสมเกิน 30 วัน']
            },
            {
              type: 'ป่วย',
              days: 30,
              description: 'วันลาป่วยประจำปี',
              conditions: ['ต้องมีใบรับรองแพทย์หากลาเกิน 3 วัน', 'สามารถสะสมได้']
            },
            {
              type: 'กิจส่วนตัว',
              days: 3,
              description: 'วันลากิจส่วนตัว',
              conditions: ['ต้องแจ้งล่วงหน้า 1 วัน', 'ไม่สามารถสะสมได้']
            },
            {
              type: 'คลอด',
              days: 98,
              description: 'วันลาคลอดสำหรับพนักงานหญิง',
              conditions: ['ต้องแจ้งล่วงหน้า 30 วัน', 'ต้องมีใบรับรองแพทย์']
            }
          ],
          procedures: [
            {
              step: 1,
              title: 'ยื่นคำขอ',
              description: 'กรอกแบบฟอร์มคำขอลาในระบบ HR',
              icon: FileText
            },
            {
              step: 2,
              title: 'รออนุมัติ',
              description: 'รอหัวหน้างานอนุมัติคำขอ',
              icon: Clock
            },
            {
              step: 3,
              title: 'ได้รับการอนุมัติ',
              description: 'ระบบจะส่งอีเมลแจ้งผลการอนุมัติ',
              icon: CheckCircle
            }
          ],
          importantNotes: [
            'การลาในวันจันทร์หรือวันศุกร์ต้องแจ้งล่วงหน้า 7 วัน',
            'การลาติดต่อกันเกิน 5 วัน ต้องได้รับอนุมัติจากผู้จัดการฝ่าย',
            'วันลาที่ไม่ได้ใช้จะหมดอายุในวันที่ 31 มีนาคม ของปีถัดไป',
            'สามารถขายวันลาพักร้อนที่เหลือได้ไม่เกิน 5 วัน'
          ]
        };
        
        setLeaveData(mockLeaveData);
      } catch (error) {
        console.error('Error fetching leave data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveData();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="leave-page">
        <div className="leave-loading">
          <div className="loading-spinner"></div>
          <p>กำลังโหลดข้อมูลการลา...</p>
        </div>
      </div>
    );
  }

  if (!leaveData) {
    return (
      <div className="leave-page">
        <div className="leave-error">
          <h2>ไม่พบข้อมูลการลา</h2>
          <p>ข้อมูลที่คุณต้องการดูอาจถูกลบหรือย้ายที่แล้ว</p>
          <Link to="/" className="btn btn-primary">
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="leave-page">
      <div className="leave-header">
        <div className="container">
          <div className="header-nav">
            <Link to="/" className="back-btn">
              <ArrowLeft size={20} />
              กลับ
            </Link>
          </div>
          
          <div className="leave-meta">
            <h1>{leaveData.title}</h1>
            <div className="meta-info">
              <div className="meta-item">
                <User size={16} />
                <span>{leaveData.author}</span>
              </div>
              <div className="meta-item">
                <Clock size={16} />
                <span>อัปเดต: {formatDate(leaveData.lastUpdated)}</span>
              </div>
            </div>
            
            <div className="leave-tags">
              {leaveData.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="leave-body">
        <div className="container">
          <div className="leave-content">
            <div className="summary-section">
              <h2>📋 สรุปนโยบาย</h2>
              <p>{leaveData.summary}</p>
            </div>

            <div className="leave-types-section">
              <h2>🏖️ ประเภทการลา</h2>
              <div className="leave-types-grid">
                {leaveData.leaveTypes.map((type, index) => (
                  <div key={index} className="leave-type-card">
                    <div className="leave-type-header">
                      <h3>{type.type}</h3>
                      <div className="leave-days">
                        <Calendar size={20} />
                        <span>{type.days} วัน</span>
                      </div>
                    </div>
                    <p className="leave-type-description">{type.description}</p>
                    <div className="leave-conditions">
                      <h4>เงื่อนไข:</h4>
                      <ul>
                        {type.conditions.map((condition, idx) => (
                          <li key={idx}>{condition}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="procedures-section">
              <h2>📝 ขั้นตอนการขอลา</h2>
              <div className="procedures-timeline">
                {leaveData.procedures.map((procedure, index) => (
                  <div key={index} className="procedure-step">
                    <div className="step-number">{procedure.step}</div>
                    <div className="step-content">
                      <div className="step-icon">
                        <procedure.icon size={24} />
                      </div>
                      <div className="step-info">
                        <h3>{procedure.title}</h3>
                        <p>{procedure.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="important-notes-section">
              <h2>⚠️ ข้อควรทราบ</h2>
              <div className="notes-list">
                {leaveData.importantNotes.map((note, index) => (
                  <div key={index} className="note-item">
                    <AlertCircle size={16} className="note-icon" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="action-section">
              <h2>🚀 การดำเนินการ</h2>
              <div className="action-buttons">
                <button className="action-btn primary">
                  <FileText size={18} />
                  ยื่นคำขอลา
                </button>
                <button className="action-btn secondary">
                  <Calendar size={18} />
                  ดูวันลาที่เหลือ
                </button>
                <button className="action-btn secondary">
                  <Clock size={18} />
                  ประวัติการลา
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeavePage;