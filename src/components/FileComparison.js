import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Eye, Download, Copy, RotateCcw } from 'lucide-react';
import './FileComparison.css';

const FileComparison = ({ leftFile, rightFile, onClose }) => {
  const [leftContent, setLeftContent] = useState('');
  const [rightContent, setRightContent] = useState('');
  const [diffLines, setDiffLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('side-by-side'); // 'side-by-side' or 'unified'

  useEffect(() => {
    if (leftFile && rightFile) {
      loadFileContents();
    }
  }, [leftFile, rightFile]);

  const loadFileContents = async () => {
    setLoading(true);
    try {
      // Mock API calls - replace with actual API
      const [leftResponse, rightResponse] = await Promise.all([
        fetchFileContent(leftFile.id),
        fetchFileContent(rightFile.id)
      ]);
      
      setLeftContent(leftResponse.content);
      setRightContent(rightResponse.content);
      
      // Calculate differences
      const differences = calculateDiff(leftResponse.content, rightResponse.content);
      setDiffLines(differences);
    } catch (error) {
      console.error('Error loading file contents:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock API function - replace with actual implementation
  const fetchFileContent = async (fileId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock file contents based on file ID
    const mockContents = {
      1: {
        content: `# นโยบายการลาพักร้อนประจำปี 2568

## 1. หลักการและวัตถุประสงค์
นโยบายนี้จัดทำขึ้นเพื่อกำหนดหลักเกณฑ์และขั้นตอนการลาพักร้อนของพนักงานทุกระดับ

## 2. สิทธิการลาพักร้อน
### 2.1 จำนวนวันลา
- พนักงานที่ทำงานครบ 1 ปี: 6 วัน
- พนักงานที่ทำงานครบ 3 ปี: 10 วัน  
- พนักงานที่ทำงานครบ 5 ปี: 15 วัน

## 3. ขั้นตอนการขออนุมัติ
1. ยื่นคำขอล่วงหน้าอย่างน้อย 7 วัน
2. กรอกแบบฟอร์มคำขอลาพักร้อน
3. ส่งให้หัวหน้างานพิจารณาอนุมัติ

## 4. ข้อควรระวัง
- ไม่สามารถลาพักร้อนในช่วงปิดบัญชีประจำเดือน
- ต้องจัดให้มีคนทำงานแทนในช่วงที่ลา`
      },
      2: {
        content: `# นโยบายการลาพักร้อนประจำปี 2569

## 1. หลักการและวัตถุประสงค์
นโยบายนี้จัดทำขึ้นเพื่อกำหนดหลักเกณฑ์และขั้นตอนการลาพักร้อนของพนักงานทุกระดับ เพื่อให้เกิดความเป็นธรรมและความชัดเจน

## 2. สิทธิการลาพักร้อน
### 2.1 จำนวนวันลา
- พนักงานที่ทำงานครบ 1 ปี: 8 วัน
- พนักงานที่ทำงานครบ 3 ปี: 12 วัน  
- พนักงานที่ทำงานครบ 5 ปี: 18 วัน
- พนักงานที่ทำงานครบ 10 ปี: 25 วัน

### 2.2 การสะสมวันลา
- วันลาที่ไม่ได้ใช้สามารถสะสมได้ไม่เกิน 45 วัน
- วันลาที่เกิน 45 วันจะหมดอายุในวันที่ 31 ธันวาคม

## 3. ขั้นตอนการขออนุมัติ
1. ยื่นคำขอล่วงหน้าอย่างน้อย 5 วัน
2. กรอกแบบฟอร์มคำขอลาพักร้อนออนไลน์
3. ส่งให้หัวหน้างานพิจารณาอนุมัติ
4. รอการอนุมัติจากระบบ HR

## 4. ข้อควรระวัง
- ไม่สามารถลาพักร้อนในช่วงปิดบัญชีประจำเดือนและไตรมาส
- ต้องจัดให้มีคนทำงานแทนในช่วงที่ลา
- สามารถยกเลิกการลาได้ภายใน 24 ชั่วโมงก่อนวันลา`
      }
    };
    
    return mockContents[fileId] || { content: 'ไม่พบเนื้อหาไฟล์' };
  };

  const calculateDiff = (leftText, rightText) => {
    const leftLines = leftText.split('\n');
    const rightLines = rightText.split('\n');
    const maxLines = Math.max(leftLines.length, rightLines.length);
    const differences = [];

    for (let i = 0; i < maxLines; i++) {
      const leftLine = leftLines[i] || '';
      const rightLine = rightLines[i] || '';
      
      let type = 'unchanged';
      if (leftLine !== rightLine) {
        if (!leftLine) type = 'added';
        else if (!rightLine) type = 'removed';
        else type = 'modified';
      }

      differences.push({
        lineNumber: i + 1,
        leftLine,
        rightLine,
        type,
        leftHighlights: type === 'modified' ? getWordDiff(leftLine, rightLine, 'left') : [],
        rightHighlights: type === 'modified' ? getWordDiff(leftLine, rightLine, 'right') : []
      });
    }

    return differences;
  };

  const getWordDiff = (leftLine, rightLine, side) => {
    const leftWords = leftLine.split(/(\s+)/);
    const rightWords = rightLine.split(/(\s+)/);
    const highlights = [];
    
    if (side === 'left') {
      leftWords.forEach((word, index) => {
        if (!rightWords.includes(word) && word.trim()) {
          highlights.push({
            word,
            index,
            type: 'removed'
          });
        }
      });
    } else {
      rightWords.forEach((word, index) => {
        if (!leftWords.includes(word) && word.trim()) {
          highlights.push({
            word,
            index,
            type: 'added'
          });
        }
      });
    }
    
    return highlights;
  };

  const highlightText = (text, highlights) => {
    if (!highlights || highlights.length === 0) return text;
    
    let highlightedText = text;
    highlights.forEach(highlight => {
      const regex = new RegExp(`\\b${highlight.word}\\b`, 'g');
      highlightedText = highlightedText.replace(
        regex,
        `<mark class="diff-${highlight.type}">${highlight.word}</mark>`
      );
    });
    
    return highlightedText;
  };

  const copyToClipboard = (content, side) => {
    navigator.clipboard.writeText(content);
    // Show toast notification
    alert(`คัดลอกเนื้อหา${side === 'left' ? 'ซ้าย' : 'ขวา'}เรียบร้อยแล้ว`);
  };

  if (loading) {
    return (
      <div className="file-comparison loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>กำลังโหลดและเปรียบเทียบไฟล์...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="file-comparison">
      <div className="comparison-header">
        <div className="header-left">
          <button onClick={onClose} className="back-btn">
            <ArrowLeft size={20} />
            กลับ
          </button>
          <h2>เปรียบเทียบไฟล์</h2>
        </div>
        
        <div className="header-controls">
          <div className="view-mode-toggle">
            <button
              className={`mode-btn ${viewMode === 'side-by-side' ? 'active' : ''}`}
              onClick={() => setViewMode('side-by-side')}
            >
              <ArrowRight size={16} />
              แบบเคียงข้าง
            </button>
            <button
              className={`mode-btn ${viewMode === 'unified' ? 'active' : ''}`}
              onClick={() => setViewMode('unified')}
            >
              <Eye size={16} />
              แบบรวม
            </button>
          </div>
          
          <button onClick={() => window.location.reload()} className="refresh-btn">
            <RotateCcw size={16} />
            รีเฟรช
          </button>
        </div>
      </div>

      <div className="file-info-bar">
        <div className="file-info left">
          <div className="file-details">
            <h3>{leftFile.title}</h3>
            <span className="file-meta">
              เวอร์ชัน: {leftFile.version} | 
              อัปเดต: {new Date(leftFile.lastUpdated).toLocaleDateString('th-TH')}
            </span>
          </div>
          <button 
            onClick={() => copyToClipboard(leftContent, 'left')}
            className="copy-btn"
          >
            <Copy size={16} />
          </button>
        </div>
        
        <div className="file-info right">
          <div className="file-details">
            <h3>{rightFile.title}</h3>
            <span className="file-meta">
              เวอร์ชัน: {rightFile.version} | 
              อัปเดต: {new Date(rightFile.lastUpdated).toLocaleDateString('th-TH')}
            </span>
          </div>
          <button 
            onClick={() => copyToClipboard(rightContent, 'right')}
            className="copy-btn"
          >
            <Copy size={16} />
          </button>
        </div>
      </div>

      <div className="diff-stats">
        <div className="stat-item added">
          <span className="stat-count">
            {diffLines.filter(line => line.type === 'added').length}
          </span>
          <span className="stat-label">เพิ่ม</span>
        </div>
        <div className="stat-item removed">
          <span className="stat-count">
            {diffLines.filter(line => line.type === 'removed').length}
          </span>
          <span className="stat-label">ลบ</span>
        </div>
        <div className="stat-item modified">
          <span className="stat-count">
            {diffLines.filter(line => line.type === 'modified').length}
          </span>
          <span className="stat-label">แก้ไข</span>
        </div>
      </div>

      <div className={`comparison-content ${viewMode}`}>
        {viewMode === 'side-by-side' ? (
          <div className="side-by-side-view">
            <div className="diff-panel left">
              <div className="panel-header">
                <h4>ไฟล์เก่า ({leftFile.version})</h4>
              </div>
              <div className="diff-content">
                {diffLines.map((line, index) => (
                  <div
                    key={index}
                    className={`diff-line ${line.type} ${!line.leftLine ? 'empty' : ''}`}
                  >
                    <span className="line-number">{line.lineNumber}</span>
                    <span 
                      className="line-content"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(line.leftLine, line.leftHighlights)
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="diff-panel right">
              <div className="panel-header">
                <h4>ไฟล์ใหม่ ({rightFile.version})</h4>
              </div>
              <div className="diff-content">
                {diffLines.map((line, index) => (
                  <div
                    key={index}
                    className={`diff-line ${line.type} ${!line.rightLine ? 'empty' : ''}`}
                  >
                    <span className="line-number">{line.lineNumber}</span>
                    <span 
                      className="line-content"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(line.rightLine, line.rightHighlights)
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="unified-view">
            <div className="diff-content">
              {diffLines.map((line, index) => (
                <div key={index} className="unified-line-group">
                  {line.type !== 'unchanged' && line.leftLine && (
                    <div className={`diff-line removed`}>
                      <span className="line-indicator">-</span>
                      <span className="line-number">{line.lineNumber}</span>
                      <span 
                        className="line-content"
                        dangerouslySetInnerHTML={{
                          __html: highlightText(line.leftLine, line.leftHighlights)
                        }}
                      />
                    </div>
                  )}
                  {line.type !== 'unchanged' && line.rightLine && (
                    <div className={`diff-line added`}>
                      <span className="line-indicator">+</span>
                      <span className="line-number">{line.lineNumber}</span>
                      <span 
                        className="line-content"
                        dangerouslySetInnerHTML={{
                          __html: highlightText(line.rightLine, line.rightHighlights)
                        }}
                      />
                    </div>
                  )}
                  {line.type === 'unchanged' && (
                    <div className="diff-line unchanged">
                      <span className="line-indicator"> </span>
                      <span className="line-number">{line.lineNumber}</span>
                      <span className="line-content">{line.leftLine}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileComparison;