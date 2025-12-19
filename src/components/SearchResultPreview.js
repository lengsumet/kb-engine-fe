import { useState, useEffect } from 'react';
import { X, FileText, Calendar, User, Tag } from 'lucide-react';
import './SearchResultPreview.css';

const SearchResultPreview = ({ 
  result, 
  isVisible, 
  onClose, 
  position = { x: 0, y: 0 } 
}) => {
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isVisible && result) {
      setLoading(true);
      // Simulate loading preview data
      setTimeout(() => {
        setPreviewData({
          excerpt: result.content + ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
          author: 'ระบบจัดการเอกสาร',
          createdDate: '2024-01-15',
          tags: ['นโยบาย', 'คู่มือ', 'ขั้นตอน'],
          fileSize: '2.4 MB',
          pages: 15,
          language: 'ไทย'
        });
        setLoading(false);
      }, 300);
    }
  }, [isVisible, result]);

  if (!isVisible || !result) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div 
      className="search-result-preview"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="preview-header">
        <div className="preview-title">
          <FileText size={16} />
          <span>ตัวอย่างเอกสาร</span>
        </div>
        <button className="preview-close" onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      {loading ? (
        <div className="preview-loading">
          <div className="loading-spinner"></div>
          <span>กำลังโหลดตัวอย่าง...</span>
        </div>
      ) : previewData ? (
        <div className="preview-content">
          <div className="preview-meta">
            <div className="meta-item">
              <User size={14} />
              <span>{previewData.author}</span>
            </div>
            <div className="meta-item">
              <Calendar size={14} />
              <span>{formatDate(previewData.createdDate)}</span>
            </div>
          </div>

          <div className="preview-excerpt">
            <h4>เนื้อหาเอกสาร</h4>
            <p>{previewData.excerpt}</p>
          </div>

          <div className="preview-details">
            <div className="detail-row">
              <span className="detail-label">ขนาดไฟล์:</span>
              <span className="detail-value">{previewData.fileSize}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">จำนวนหน้า:</span>
              <span className="detail-value">{previewData.pages} หน้า</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">ภาษา:</span>
              <span className="detail-value">{previewData.language}</span>
            </div>
          </div>

          {previewData.tags && previewData.tags.length > 0 && (
            <div className="preview-tags">
              <div className="tags-label">
                <Tag size={14} />
                <span>แท็ก:</span>
              </div>
              <div className="tags-list">
                {previewData.tags.map((tag, index) => (
                  <span key={index} className="preview-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="preview-actions">
            <button className="preview-btn primary">
              เปิดเอกสาร
            </button>
            <button className="preview-btn secondary">
              ดาวน์โหลด
            </button>
          </div>
        </div>
      ) : (
        <div className="preview-error">
          <span>ไม่สามารถโหลดตัวอย่างได้</span>
        </div>
      )}
    </div>
  );
};

export default SearchResultPreview;