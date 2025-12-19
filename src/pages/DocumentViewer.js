import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Bookmark, Clock, User, Tag } from 'lucide-react';
import './DocumentViewer.css';

const DocumentViewer = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockDocument = {
          id: parseInt(id),
          title: 'อัปเดตการ INCENTIVE สินเชื่อระดับผู้จัดการพื้นที่ขึ้นไป',
          summary: 'เอกสารนี้เป็นการอัปเดต Incentive สินเชื่อระดับผู้จัดการพื้นที่ขึ้นไป เริ่มใช้ 1 สิงหาคม 2568 เพื่อสร้างเป้าหมายการทำงานที่ชัดเจนและให้พนักงานรู้ว่าจะได้รับผลตอบแทนเท่าไหร่เมื่อทำงานสำเร็จ โครงสร้างแบ่งเป็น 2 ประเภทคือ Special Incentive สำหรับสาขาอายุ 1-12 เดือน ที่ต้องรักษาคุณภาพหนี้และความพึงพอใจลูกค้า และ Normal Incentive สำหรับสาขาอายุเกิน 12 เดือน ที่มีทั้งหมด 26 เป้าหมายจาก 6 หัวข้อการทำงาน ได้แก่ การติดตามและจัดเก็บหนี้ (16 เป้า) คุณภาพพอร์ตสินเชื่อ (3 เป้า) การเติบโตของพอร์ตสินเชื่อ (3 เป้า) ความพึงพอใจลูกค้า (1 เป้า) การปฏิบัติตามเกณฑ์ออดิท (1 เป้า) และการบริหารจัดการคน (2 เป้า) เป้าหมายและรางวัลจะถูกกำหนดใน Power BI ทุกวันที่ 1 ของเดือน แบ่งเป็น 7 Tier โดย Tier 1 คือ %Achievement 100% และใช้ตัวคูณ 2 ตัว (อัตราตัวชี้วัดที่ถึงเป้าหมาย และ Achievement เฉลี่ย) ที่มีค่า 0.3-1.0 มาคูณกับรางวัลที่ได้รับ เงื่อนไขการจ่ายกำหนดว่าพนักงานต้องไม่ลาติดต่อกันเกิน 15 วัน หากลาออกล่วงหน้า 30 วันจะได้รับ Incentive จนถึงวันสุดท้าย และกรณีทุจริตจะถูกระงับการจ่ายทันที',
          content: `HTML5 และ CSS3 เป็นเทคโนโลยีพื้นฐานสำหรับการพัฒนาเว็บไซต์สมัยใหม่ ที่ช่วยให้นักพัฒนาสามารถสร้างเว็บไซต์ที่มีประสิทธิภาพและสวยงาม

HTML5 Semantic Elements ช่วยให้โครงสร้างหน้าเว็บมีความหมายมากขึ้น เช่น <header>, <nav>, <main>, <section>, <article>, <aside>, และ <footer>

CSS3 Layout Techniques มีหลายวิธี เช่น Flexbox ที่เหมาะสำหรับการจัดวางแบบ 1 มิติ และ CSS Grid ที่เหมาะสำหรับ layout 2 มิติที่ซับซ้อน

CSS Animations และ Transitions ช่วยให้เว็บไซต์มีความเคลื่อนไหวที่สวยงาม Transitions ใช้สำหรับการเปลี่ยนแปลงค่า CSS แบบค่อยเป็นค่อยไป ส่วน Animations ใช้สำหรับการสร้างแอนิเมชันที่ซับซ้อนมากขึ้น

Responsive Web Design เป็นการออกแบบเว็บไซต์ให้รองรับทุกขนาดหน้าจอ ด้วยการใช้ Media Queries, Flexible Grid Systems และ Flexible Images`,
          pdfUrl: '/สื่อความสาขา-การจัดการเบิกจ่ายภาษีป้ายประจำปี-3-1-ผสาน-หน้า.pdf',
          category: 'สื่อความสาขา',
          lastUpdated: '2024-01-15T10:30:00',
          author: 'ทีมพัฒนาเว็บไซต์',
          version: '2.1',
          tags: ['INCENTIVE', 'สื่อความสาขา', 'ผู้จัดการสาขา'],
          relatedDocuments: [
            { 
              id: 2, 
              title: 'สื่อความสาขา การคิด Incentive ระดับพื้นที่',
              lastUpdated: '2024-01-10'
            },
            { 
              id: 3, 
              title: 'สื่อความสาขา การคิด Incentive ระดับสาขา',
              lastUpdated: '2024-01-08'
            },
            { 
              id: 4, 
              title: 'สื่อความสาขา การคิด Incentive ระดับสาขา',
              lastUpdated: '2023-12-15'
            }
          ],
          latestDocuments: [
            {
              id: 7,
              title: 'สื่อความสาขา อัปเดตหน้าติดตามทวงถามหนี้',
              lastUpdated: '2025-12-18'
            },
            {
              id: 8,
              title: 'สื่อความสาขา การจัดการเบิกจ่ายภาษีป้ายประจำปี',
              lastUpdated: '2025-12-18'
            },
            {
              id: 9,
              title: 'สื่อความสาขา การสร้างความสัมพันธ์กับลูกค้าสถานะ',
              lastUpdated: '2025-12-18'
            }
          ],
          previousVersions: [
            {
              version: '1.0',
              title: 'สื่อความสาขา อัปเดตหน้าติดตามทวงถามหนี้',
              date: '15 ธันวาคม 2025',
              description: 'เอกสารฉบับแรกที่อธิบายอัปเดตหน้าติดตามทวงถามหนี้'
            },
            {
              version: '1.5',
              title: 'สื่อความสาขา การจัดการเบิกจ่ายภาษีป้ายประจำปี',
              date: '28 ธันวาคม 2023',
              description: 'เพิ่มเติมเนื้อหาเกี่ยวกับการจัดการเบิกจ่ายภาษีป้ายประจำปี'
            }
          ],
          otherRelated: [
            {
              id: 10,
              title: 'React Hooks คือ อะไร? ใช้งานอย่างไร ในปี 2024',
              category: 'React Hooks คือ อะไร?',
              date: '5 มกราคม 2024',
              description: 'คู่มือการใช้งาน React Hooks แบบครบถ้วน พร้อมตัวอย่างโค้ด',
              featured: true
            },
            {
              id: 11,
              title: 'TypeScript ขั้นพื้นฐาน สำหรับผู้เริ่มต้น',
              category: 'TypeScript',
              date: '12 มกราคม 2024',
              description: 'เรียนรู้ TypeScript จากพื้นฐานสู่การใช้งานจริง'
            },
            {
              id: 12,
              title: 'สร้างเว็บไซต์ด้วย Next.js 14 แบบ Step by Step',
              category: 'Next.js',
              date: '18 มกราคม 2024',
              description: 'คู่มือการสร้างเว็บไซต์ด้วย Next.js เวอร์ชันล่าสุด'
            }
          ]
        };
        
        setDocument(mockDocument);
      } catch (error) {
        console.error('Error fetching document:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'เมื่อวาน';
    if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} สัปดาห์ที่แล้ว`;
    return `${Math.ceil(diffDays / 30)} เดือนที่แล้ว`;
  };

  const handleSelectForComparison = (doc) => {
    setSelectedDoc(doc);
    setComparisonData(null);
  };

  const handleCompare = () => {
    if (!selectedDoc) return;

    // คำนวณความคล้ายคลึง
    const getWords = (text) => text.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    const words1 = getWords(document.summary + ' ' + document.content);
    const words2 = getWords(selectedDoc.summary || selectedDoc.description || '');
    
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    
    const commonKeywords = Array.from(intersection).slice(0, 10);
    
    const comparison = {
      doc1: {
        title: document.title,
        keywordCount: commonKeywords.length,
        totalWords: words1.length,
        summary: document.summary,
        icon: '📄'
      },
      doc2: {
        title: selectedDoc.title,
        keywordCount: commonKeywords.length,
        totalWords: words2.length,
        summary: selectedDoc.summary || selectedDoc.description,
        icon: '📘'
      },
      commonKeywords: commonKeywords,
      differences: [
        `บทความแรกใช้ตัวคูณที่มีค่า 0.3-1.0 แต่บทความที่นำมาเปรียบเทียบใช้ตัวคูณเป็น 0.5-1.0`,
      ]
    };
    
    setComparisonData(comparison);
    
    // Scroll to comparison section
    setTimeout(() => {
      const comparisonSection = window.document.getElementById('comparison-section');
      if (comparisonSection) {
        comparisonSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  if (loading) {
    return (
      <div className="document-viewer">
        <div className="document-loading">
          <div className="loading-spinner"></div>
          <p>กำลังโหลดเอกสาร...</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="document-viewer">
        <div className="document-error">
          <h2>ไม่พบเอกสาร</h2>
          <p>เอกสารที่คุณต้องการดูอาจถูกลบหรือย้ายที่แล้ว</p>
          <Link to="/" className="btn btn-primary">
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="document-viewer">
      <div className="document-header">
        <div className="container">
          <div className="header-nav">
            <Link to="/" className="back-btn">
              <ArrowLeft size={20} />
              กลับ
            </Link>
          </div>
          
          <div className="document-meta">
            <h1>{document.title}</h1>
            <div className="meta-info">
              <div className="meta-item">
                <User size={16} />
                <span>{document.author}</span>
              </div>
              <div className="meta-item">
                <Clock size={16} />
                <span>อัปเดต: {formatDate(document.lastUpdated)}</span>
              </div>
              <div className="meta-item">
                <Tag size={16} />
                <span>เวอร์ชัน {document.version}</span>
              </div>
            </div>
            
            <div className="document-tags">
              {document.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="document-actions">
            <button className="action-btn">
              <Bookmark size={18} />
              บันทึก
            </button>
            <button className="action-btn">
              <Share2 size={18} />
              แชร์
            </button>
            <button className="action-btn primary">
              <Download size={18} />
              ดาวน์โหลด
            </button>
          </div>
        </div>
      </div>

      <div className="document-body">
        <div className="container">
          <div className="document-layout">
            <main className="document-content">
              <div className="article-summary-box">
                <h3>📝 สรุปเนื้อหา</h3>
                <p>{document.summary}</p>
              </div>
              
              <div className="content-wrapper">
                {document.pdfUrl ? (
                  <div className="pdf-viewer">
                    <iframe
                      src={document.pdfUrl}
                      title="PDF Viewer"
                      width="100%"
                      height="800px"
                      style={{ border: 'none', borderRadius: '8px' }}
                    />
                  </div>
                ) : (
                  <div className="document-text">{document.content}</div>
                )}
              </div>
            </main>
            
            <aside className="document-sidebar">
              <div className="sidebar-section">
                <h2 className="sidebar-title">บทความที่เกี่ยวข้อง</h2>
                <div className="related-list">
                  {document.relatedDocuments.map((doc, index) => (
                    <div 
                      key={doc.id} 
                      className={`related-item-wrapper ${selectedDoc?.id === doc.id ? 'selected' : ''}`}
                    >
                      <Link to={`/document/${doc.id}`} className="related-item">
                        <div className="related-number">{index + 1}</div>
                        <div className="related-content">
                          <div className="related-title">{doc.title}</div>
                          <div className="related-date">{formatRelativeDate(doc.lastUpdated)}</div>
                        </div>
                      </Link>
                      <button 
                        className="compare-icon-btn"
                        onClick={() => handleSelectForComparison({...doc, category: 'JavaScript', summary: 'เอกสารนี้เป็นการอัปเดต Incentive สินเชื่อระดับผู้จัดการพื้นที่ขึ้นไป เริ่มใช้ 1 สิงหาคม 2568 เพื่อสร้างเป้าหมายการทำงานที่ชัดเจนและให้พนักงานรู้ว่าจะได้รับผลตอบแทนเท่าไหร่เมื่อทำงานสำเร็จ โครงสร้างแบ่งเป็น 2 ประเภทคือ Special Incentive สำหรับสาขาอายุ 1-12 เดือน ที่ต้องรักษาคุณภาพหนี้และความพึงพอใจลูกค้า และ Normal Incentive สำหรับสาขาอายุเกิน 12 เดือน ที่มีทั้งหมด 26 เป้าหมายจาก 6 หัวข้อการทำงาน ได้แก่ การติดตามและจัดเก็บหนี้ (16 เป้า) คุณภาพพอร์ตสินเชื่อ (3 เป้า) การเติบโตของพอร์ตสินเชื่อ (3 เป้า) ความพึงพอใจลูกค้า (1 เป้า) การปฏิบัติตามเกณฑ์ออดิท (1 เป้า) และการบริหารจัดการคน (2 เป้า) เป้าหมายและรางวัลจะถูกกำหนดใน Power BI ทุกวันที่ 1 ของเดือน แบ่งเป็น 7 Tier โดย Tier 1 คือ %Achievement 100% และใช้ตัวคูณ 2 ตัว (อัตราตัวชี้วัดที่ถึงเป้าหมาย และ Achievement เฉลี่ย) ที่มีค่า 0.5-1.0 มาคูณกับรางวัลที่ได้รับ เงื่อนไขการจ่ายกำหนดว่าพนักงานต้องไม่ลาติดต่อกันเกิน 15 วัน หากลาออกล่วงหน้า 30 วันจะได้รับ Incentive จนถึงวันสุดท้าย และกรณีทุจริตจะถูกระงับการจ่ายทันที'})}
                        title="เปรียบเทียบบทความ"
                      >
                        ⚖️
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sidebar-section">
                <h2 className="sidebar-title">บทความใหม่ล่าสุด</h2>
                <div className="related-list">
                  {document.latestDocuments.map((doc, index) => (
                    <div 
                      key={doc.id} 
                      className={`related-item-wrapper ${selectedDoc?.id === doc.id ? 'selected' : ''}`}
                    >
                      <Link to={`/document/${doc.id}`} className="related-item">
                        <div className="related-number">{index + 1}</div>
                        <div className="related-content">
                          <div className="related-title">{doc.title}</div>
                          <div className="related-date">{formatRelativeDate(doc.lastUpdated)}</div>
                        </div>
                      </Link>
                      <button 
                        className="compare-icon-btn"
                        onClick={() => handleSelectForComparison({...doc, category: 'CSS Framework', summary: 'เอกสารนี้เป็นการอัปเดต Incentive สินเชื่อระดับผู้จัดการพื้นที่ขึ้นไป เริ่มใช้ 1 สิงหาคม 2568 เพื่อสร้างเป้าหมายการทำงานที่ชัดเจนและให้พนักงานรู้ว่าจะได้รับผลตอบแทนเท่าไหร่เมื่อทำงานสำเร็จ โครงสร้างแบ่งเป็น 2 ประเภทคือ Special Incentive สำหรับสาขาอายุ 1-12 เดือน ที่ต้องรักษาคุณภาพหนี้และความพึงพอใจลูกค้า และ Normal Incentive สำหรับสาขาอายุเกิน 12 เดือน ที่มีทั้งหมด 26 เป้าหมายจาก 6 หัวข้อการทำงาน ได้แก่ การติดตามและจัดเก็บหนี้ (16 เป้า) คุณภาพพอร์ตสินเชื่อ (3 เป้า) การเติบโตของพอร์ตสินเชื่อ (3 เป้า) ความพึงพอใจลูกค้า (1 เป้า) การปฏิบัติตามเกณฑ์ออดิท (1 เป้า) และการบริหารจัดการคน (2 เป้า) เป้าหมายและรางวัลจะถูกกำหนดใน Power BI ทุกวันที่ 1 ของเดือน แบ่งเป็น 7 Tier โดย Tier 1 คือ %Achievement 100% และใช้ตัวคูณ 2 ตัว (อัตราตัวชี้วัดที่ถึงเป้าหมาย และ Achievement เฉลี่ย) ที่มีค่า 0.5-1.0 มาคูณกับรางวัลที่ได้รับ เงื่อนไขการจ่ายกำหนดว่าพนักงานต้องไม่ลาติดต่อกันเกิน 15 วัน หากลาออกล่วงหน้า 30 วันจะได้รับ Incentive จนถึงวันสุดท้าย และกรณีทุจริตจะถูกระงับการจ่ายทันที'})}
                        title="เปรียบเทียบบทความ"
                      >
                        ⚖️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <div id="comparison-section" className="document-comparison">
        <div className="container">
          <div className="comparison-header">
            <h2 className="comparison-title">📊 เปรียบเทียบเอกสารความรู้</h2>
          </div>
          
          {!selectedDoc && !comparisonData && (
            <div className="comparison-selection">
              <div className="selection-grid">
                <div className="selection-card">
                  <div className="selection-icon">📄</div>
                  <div className="selection-info">
                    <div className="selection-label">บทความปัจจุบัน</div>
                    <div className="selection-title">{document.title}</div>
                    <div className="selection-date">{formatDate(document.lastUpdated)}</div>
                  </div>
                </div>
                
                <div className="selection-card empty">
                  <div className="selection-icon">❓</div>
                  <div className="selection-info">
                    <div className="selection-label">เลือกบทความเพื่อเปรียบเทียบ</div>
                    <div className="selection-title">กดปุ่ม ⚖️ ที่บทความด้านบน</div>
                    <div className="selection-date">เพื่อเลือกบทความที่ต้องการเปรียบเทียบ</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {selectedDoc && !comparisonData && (
            <div className="comparison-selection">
              <div className="selection-grid">
                <div className="selection-card">
                  <div className="selection-icon">📄</div>
                  <div className="selection-info">
                    <div className="selection-label">บทความปัจจุบัน</div>
                    <div className="selection-title">{document.title}</div>
                    <div className="selection-date">{formatDate(document.lastUpdated)}</div>
                  </div>
                </div>
                
                <div className="selection-card selected">
                  <div className="selection-icon">📘</div>
                  <div className="selection-info">
                    <div className="selection-label">บทความที่เลือกเพื่อเปรียบเทียบ</div>
                    <div className="selection-title">{selectedDoc.title}</div>
                    <div className="selection-date">{formatDate(selectedDoc.lastUpdated)}</div>
                  </div>
                </div>
              </div>
              
              <button className="compare-action-btn" onClick={handleCompare}>
                เปรียบเทียบบทความ
              </button>
            </div>
          )}

          {comparisonData && (
            <>
              <div className="comparison-selection">
                <div className="selection-grid">
                  <div className="selection-card">
                    <div className="selection-icon">{comparisonData.doc1.icon}</div>
                    <div className="selection-info">
                      <div className="selection-label">บทความปัจจุบัน</div>
                      <div className="selection-title">{comparisonData.doc1.title}</div>
                      <div className="selection-date">{formatDate(document.lastUpdated)}</div>
                    </div>
                  </div>
                  
                  <div className="selection-card selected">
                    <div className="selection-icon">{comparisonData.doc2.icon}</div>
                    <div className="selection-info">
                      <div className="selection-label">บทความที่เลือกเพื่อเปรียบเทียบ</div>
                      <div className="selection-title">{comparisonData.doc2.title}</div>
                      <div className="selection-date">{formatDate(selectedDoc.lastUpdated)}</div>
                    </div>
                  </div>
                </div>
                
                <button className="compare-action-btn" onClick={handleCompare}>
                  เปรียบเทียบบทความ
                </button>
              </div>

              <div className="comparison-result">
                <div className="result-grid">
                  <div className="result-section">
                    <h3 className="result-title">📋 บทความปัจจุบัน</h3>
                    <div className="result-stats">
                      <div className="stat-item">
                        <span className="stat-label">จำนวนคำสำคัญ:</span>
                        <span className="stat-value">{comparisonData.doc1.keywordCount} คำ</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">ความยาวบทความ:</span>
                        <span className="stat-value">{comparisonData.doc1.totalWords} คำ</span>
                      </div>
                    </div>
                    <div className="result-content">
                      <h4 className="content-title">{comparisonData.doc1.title}</h4>
                      <p className="content-description">{comparisonData.doc1.summary}</p>
                    </div>
                  </div>

                  <div className="result-section">
                    <h3 className="result-title">🔍 บทความที่เปรียบเทียบ</h3>
                    <div className="result-stats">
                      <div className="stat-item">
                        <span className="stat-label">จำนวนคำสำคัญ:</span>
                        <span className="stat-value">{comparisonData.doc2.keywordCount} คำ</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">ความยาวบทความ:</span>
                        <span className="stat-value">{comparisonData.doc2.totalWords} คำ</span>
                      </div>
                    </div>
                    <div className="result-content">
                      <h4 className="content-title">{comparisonData.doc2.title}</h4>
                      <p className="content-description">{comparisonData.doc2.summary}</p>
                    </div>
                  </div>
                </div>

                <button className="compare-action-btn" onClick={handleCompare}>
                  เปรียบเทียบบทความ
                </button>

                <div className="comparison-details">
                  <div className="details-section">
                    <h3 className="details-title">📋 บทความปัจจุบัน</h3>
                    <div className="details-stats">
                      <div className="stat-item">
                        <span className="stat-label">จำนวนคำสำคัญ:</span>
                        <span className="stat-value">{comparisonData.doc1.keywordCount} คำ</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">ความยาวบทความ:</span>
                        <span className="stat-value">{comparisonData.doc1.totalWords} คำ</span>
                      </div>
                    </div>
                    <div className="details-content">
                      <h4>{comparisonData.doc1.title}</h4>
                      <p>{comparisonData.doc1.summary}</p>
                    </div>
                  </div>

                  <div className="details-section">
                    <h3 className="details-title">🔍 บทความที่เปรียบเทียบ</h3>
                    <div className="details-stats">
                      <div className="stat-item">
                        <span className="stat-label">จำนวนคำสำคัญ:</span>
                        <span className="stat-value">{comparisonData.doc2.keywordCount} คำ</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">ความยาวบทความ:</span>
                        <span className="stat-value">{comparisonData.doc2.totalWords} คำ</span>
                      </div>
                    </div>
                    <div className="details-content">
                      <h4>{comparisonData.doc2.title}</h4>
                      <p>{comparisonData.doc2.summary}</p>
                    </div>
                  </div>
                </div>

                <div className="comparison-differences">
                  <h3 className="differences-title">🔍 ความแตกต่าง</h3>
                  <div className="differences-list">
                    {comparisonData.differences.map((diff, index) => (
                      <div key={index} className="difference-item">
                        <div className="difference-icon">▸</div>
                        <div className="difference-text">{diff}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
