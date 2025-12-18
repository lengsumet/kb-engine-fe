import React from 'react';
import { Calendar, ArrowRight, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import './TimelineComparison.css';

const TimelineComparison = ({ year1, year2, comparisonData, loading }) => {
  if (loading) {
    return (
      <div className="timeline-comparison loading">
        <div className="loading-spinner"></div>
        <p>กำลังเปรียบเทียบข้อมูลระหว่างปี {year1} และ {year2}...</p>
      </div>
    );
  }

  if (!comparisonData || comparisonData.length === 0) {
    return (
      <div className="timeline-comparison empty">
        <AlertCircle size={48} />
        <h3>ไม่พบข้อมูลเปรียบเทียบ</h3>
        <p>ไม่มีข้อมูลสำหรับการเปรียบเทียบระหว่างปี {year1} และ {year2}</p>
      </div>
    );
  }

  const getChangeType = (change) => {
    if (change.type === 'added') return 'added';
    if (change.type === 'removed') return 'removed';
    if (change.type === 'modified') return 'modified';
    return 'unchanged';
  };

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case 'added': return <CheckCircle size={16} className="change-icon added" />;
      case 'removed': return <AlertCircle size={16} className="change-icon removed" />;
      case 'modified': return <Clock size={16} className="change-icon modified" />;
      default: return <Calendar size={16} className="change-icon unchanged" />;
    }
  };

  const getChangeLabel = (changeType) => {
    switch (changeType) {
      case 'added': return 'เพิ่มใหม่';
      case 'removed': return 'ยกเลิก';
      case 'modified': return 'แก้ไข';
      default: return 'ไม่เปลี่ยนแปลง';
    }
  };

  return (
    <div className="timeline-comparison">
      <div className="comparison-header">
        <div className="year-labels">
          <div className="year-label year1">
            <Calendar size={20} />
            <span>ปี {year1}</span>
          </div>
          <ArrowRight size={24} className="arrow-icon" />
          <div className="year-label year2">
            <Calendar size={20} />
            <span>ปี {year2}</span>
          </div>
        </div>
        <div className="comparison-stats">
          <div className="stat-item added">
            <span className="stat-count">{comparisonData.filter(item => item.type === 'added').length}</span>
            <span className="stat-label">เพิ่มใหม่</span>
          </div>
          <div className="stat-item modified">
            <span className="stat-count">{comparisonData.filter(item => item.type === 'modified').length}</span>
            <span className="stat-label">แก้ไข</span>
          </div>
          <div className="stat-item removed">
            <span className="stat-count">{comparisonData.filter(item => item.type === 'removed').length}</span>
            <span className="stat-label">ยกเลิก</span>
          </div>
        </div>
      </div>

      <div className="comparison-timeline">
        {comparisonData.map((item, index) => {
          const changeType = getChangeType(item);
          return (
            <div key={index} className={`timeline-item ${changeType}`}>
              <div className="timeline-marker">
                {getChangeIcon(changeType)}
              </div>
              
              <div className="timeline-content">
                <div className="item-header">
                  <h4 className="item-title">{item.title}</h4>
                  <span className={`change-badge ${changeType}`}>
                    {getChangeLabel(changeType)}
                  </span>
                </div>
                
                <div className="item-details">
                  <div className="detail-row">
                    <span className="detail-label">หมวดหมู่:</span>
                    <span className="detail-value">{item.category}</span>
                  </div>
                  
                  {item.dates && (
                    <div className="date-comparison">
                      <div className="date-item">
                        <span className="date-label">ปี {year1}:</span>
                        <span className="date-value">{item.dates.year1 || 'ไม่มีข้อมูล'}</span>
                      </div>
                      <div className="date-item">
                        <span className="date-label">ปี {year2}:</span>
                        <span className="date-value">{item.dates.year2 || 'ไม่มีข้อมูล'}</span>
                      </div>
                    </div>
                  )}
                  
                  {item.description && (
                    <p className="item-description">{item.description}</p>
                  )}
                  
                  {item.changes && item.changes.length > 0 && (
                    <div className="change-details">
                      <span className="changes-label">รายละเอียดการเปลี่ยนแปลง:</span>
                      <ul className="changes-list">
                        {item.changes.map((change, changeIndex) => (
                          <li key={changeIndex} className="change-item">
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineComparison;