import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Bookmark, Clock, User, Tag } from 'lucide-react';
import './DocumentViewer.css';

const DocumentViewer = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock document fetch - replace with actual API call
    const fetchDocument = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock document data
        const mockDocument = {
          id: parseInt(id),
          title: 'นโยบายการลาพักร้อนประจำปี 2024',
          content: `
# นโยบายการลาพักร้อนประจำปี 2024

## 1. หลักการและวัตถุประสงค์

นโยบายนี้จัดทำขึ้นเพื่อกำหนดหลักเกณฑ์และขั้นตอนการลาพักร้อนของพนักงานทุกระดับ เพื่อให้เกิดความเป็นธรรมและความชัดเจนในการบริหารจัดการ

## 2. ขอบเขตการใช้บังคับ

นโยบายนี้ใช้บังคับกับพนักงานประจำทุกคนที่ทำงานครบ 1 ปี

## 3. สิทธิการลาพักร้อน

### 3.1 จำนวนวันลา
- พนักงานที่ทำงานครบ 1 ปี: 6 วัน
- พนักงานที่ทำงานครบ 3 ปี: 10 วัน  
- พนักงานที่ทำงานครบ 5 ปี: 15 วัน
- พนักงานที่ทำงานครบ 10 ปี: 20 วัน

### 3.2 การสะสมวันลา
- วันลาที่ไม่ได้ใช้สามารถสะสมได้ไม่เกิน 30 วัน
- วันลาที่เกิน 30 วันจะหมดอายุในวันที่ 31 ธันวาคม

## 4. ขั้นตอนการขออนุมัติ

### 4.1 การยื่นคำขอ
1. ยื่นคำขอล่วงหน้าอย่างน้อย 7 วัน
2. กรอกแบบฟอร์มคำขอลาพักร้อน
3. ส่งให้หัวหน้างานพิจารณาอนุมัติ

### 4.2 การอนุมัติ
- หัวหน้างานต้องพิจารณาภายใน 3 วันทำการ
- กรณีลาเกิน 5 วันต่อเนื่อง ต้องได้รับอนุมัติจากผู้จัดการแผนก

## 5. ข้อควรระวัง

- ไม่สามารถลาพักร้อนในช่วงปิดบัญชีประจำเดือน
- ต้องจัดให้มีคนทำงานแทนในช่วงที่ลา
- กรณีฉุกเฉินสามารถยื่นคำขอย้อนหลังได้ภายใน 24 ชั่วโมง

---

*เอกสารนี้มีผลบังคับใช้ตั้งแต่วันที่ 1 มกราคม 2024*
          `,
          category: 'hr',
          fileType: 'pdf',
          lastUpdated: '2024-01-15T10:30:00',
          author: 'ฝ่ายทรัพยากรบุคคล',
          version: '2.1',
          tags: ['นโยบาย', 'การลา', 'HR', 'พนักงาน'],
          relatedDocuments: [
            { id: 2, title: 'แบบฟอร์มคำขอลาพักร้อน' },
            { id: 3, title: 'นโยบายการลาป่วย' },
            { id: 4, title: 'ปฏิทินวันหยุดประจำปี 2024' }
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              <div className="content-wrapper">
                <pre className="document-text">{document.content}</pre>
              </div>
            </main>
            
            <aside className="document-sidebar">
              <div className="sidebar-section">
                <h3>เอกสารที่เกี่ยวข้อง</h3>
                <div className="related-documents">
                  {document.relatedDocuments.map((doc) => (
                    <Link
                      key={doc.id}
                      to={`/document/${doc.id}`}
                      className="related-doc"
                    >
                      {doc.title}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;