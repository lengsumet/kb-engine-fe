import React, { useState, useEffect } from 'react';
import { Search, FileText, Calendar, User, ArrowRight, X } from 'lucide-react';
import './FileSelector.css';

const FileSelector = ({ onCompare, onClose }) => {
  const [leftFile, setLeftFile] = useState(null);
  const [rightFile, setRightFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadFiles();
  }, [searchQuery, selectedCategory]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock file data
      const mockFiles = [
        {
          id: 1,
          title: 'นโยบายการลาพักร้อนประจำปี 2568',
          category: 'hr',
          version: '1.0',
          lastUpdated: '2024-01-15T10:30:00Z',
          author: 'ฝ่ายทรัพยากรบุคคล',
          fileType: 'pdf',
          size: '245 KB'
        },
        {
          id: 2,
          title: 'นโยบายการลาพักร้อนประจำปี 2569',
          category: 'hr',
          version: '2.0',
          lastUpdated: '2024-12-01T14:20:00Z',
          author: 'ฝ่ายทรัพยากรบุคคล',
          fileType: 'pdf',
          size: '267 KB'
        },
        {
          id: 3,
          title: 'คู่มือการใช้งานระบบสินเชื่อ V1.5',
          category: 'credit',
          version: '1.5',
          lastUpdated: '2024-06-15T09:15:00Z',
          author: 'ฝ่ายสินเชื่อ',
          fileType: 'pdf',
          size: '1.2 MB'
        },
        {
          id: 4,
          title: 'คู่มือการใช้งานระบบสินเชื่อ V2.0',
          category: 'credit',
          version: '2.0',
          lastUpdated: '2024-11-20T16:45:00Z',
          author: 'ฝ่ายสินเชื่อ',
          fileType: 'pdf',
          size: '1.5 MB'
        },
        {
          id: 5,
          title: 'วิธีการแก้ไขปัญหาระบบ IT เบื้องต้น',
          category: 'it',
          version: '1.0',
          lastUpdated: '2024-03-10T11:30:00Z',
          author: 'ฝ่าย IT',
          fileType: 'document',
          size: '890 KB'
        },
        {
          id: 6,
          title: 'วิธีการแก้ไขปัญหาระบบ IT เบื้องต้น (อัปเดต)',
          category: 'it',
          version: '1.1',
          lastUpdated: '2024-10-05T13:20:00Z',
          author: 'ฝ่าย IT',
          fileType: 'document',
          size: '945 KB'
        }
      ];

      // Filter files based on search and category
      let filteredFiles = mockFiles;
      
      if (searchQuery) {
        filteredFiles = filteredFiles.filter(file =>
          file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.author.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (selectedCategory !== 'all') {
        filteredFiles = filteredFiles.filter(file => file.category === selectedCategory);
      }

      setFiles(filteredFiles);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file, side) => {
    if (side === 'left') {
      setLeftFile(file);
    } else {
      setRightFile(file);
    }
  };

  const handleCompare = () => {
    if (leftFile && rightFile) {
      onCompare(leftFile, rightFile);
    }
  };

  const clearSelection = (side) => {
    if (side === 'left') {
      setLeftFile(null);
    } else {
      setRightFile(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'hr': 'นโยบาย HR',
      'credit': 'นโยบายสินเชื่อ',
      'it': 'คู่มือ IT',
      'operation': 'คู่มือปฏิบัติงาน',
      'compliance': 'กฎระเบียบ'
    };
    return labels[category] || category;
  };

  return (
    <div className="file-selector">
      <div className="selector-header">
        <div className="header-left">
          <h2>เลือกไฟล์เพื่อเปรียบเทียบ</h2>
          <p>เลือกไฟล์ 2 ไฟล์เพื่อดูความแตกต่าง</p>
        </div>
        <button onClick={onClose} className="close-btn">
          <X size={20} />
        </button>
      </div>

      <div className="selection-area">
        <div className="selected-files">
          <div className="selected-file left">
            <div className="file-slot">
              <h3>ไฟล์ที่ 1 (เก่า)</h3>
              {leftFile ? (
                <div className="selected-file-card">
                  <div className="file-info">
                    <h4>{leftFile.title}</h4>
                    <div className="file-meta">
                      <span>เวอร์ชัน: {leftFile.version}</span>
                      <span>อัปเดต: {formatDate(leftFile.lastUpdated)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => clearSelection('left')}
                    className="clear-btn"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="empty-slot">
                  <FileText size={32} />
                  <p>คลิกเลือกไฟล์จากรายการด้านล่าง</p>
                </div>
              )}
            </div>
          </div>

          <div className="vs-divider">
            <ArrowRight size={24} />
            <span>VS</span>
          </div>

          <div className="selected-file right">
            <div className="file-slot">
              <h3>ไฟล์ที่ 2 (ใหม่)</h3>
              {rightFile ? (
                <div className="selected-file-card">
                  <div className="file-info">
                    <h4>{rightFile.title}</h4>
                    <div className="file-meta">
                      <span>เวอร์ชัน: {rightFile.version}</span>
                      <span>อัปเดต: {formatDate(rightFile.lastUpdated)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => clearSelection('right')}
                    className="clear-btn"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="empty-slot">
                  <FileText size={32} />
                  <p>คลิกเลือกไฟล์จากรายการด้านล่าง</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="compare-action">
          <button 
            onClick={handleCompare}
            disabled={!leftFile || !rightFile}
            className="compare-btn"
          >
            เปรียบเทียบไฟล์
          </button>
        </div>
      </div>

      <div className="file-browser">
        <div className="browser-controls">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="ค้นหาไฟล์..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            <option value="all">ทุกหมวดหมู่</option>
            <option value="hr">นโยบาย HR</option>
            <option value="credit">นโยบายสินเชื่อ</option>
            <option value="it">คู่มือ IT</option>
            <option value="operation">คู่มือปฏิบัติงาน</option>
            <option value="compliance">กฎระเบียบ</option>
          </select>
        </div>

        <div className="file-list">
          {loading ? (
            <div className="loading-files">
              <div className="loading-spinner"></div>
              <p>กำลังโหลดไฟล์...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="no-files">
              <FileText size={48} />
              <h3>ไม่พบไฟล์</h3>
              <p>ลองเปลี่ยนคำค้นหาหรือหมวดหมู่</p>
            </div>
          ) : (
            <div className="files-grid">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`file-card ${
                    leftFile?.id === file.id ? 'selected-left' : 
                    rightFile?.id === file.id ? 'selected-right' : ''
                  }`}
                >
                  <div className="file-header">
                    <div className="file-icon">
                      <FileText size={20} />
                    </div>
                    <div className="file-category">
                      {getCategoryLabel(file.category)}
                    </div>
                  </div>
                  
                  <div className="file-content">
                    <h4>{file.title}</h4>
                    <div className="file-details">
                      <div className="detail-row">
                        <User size={14} />
                        <span>{file.author}</span>
                      </div>
                      <div className="detail-row">
                        <Calendar size={14} />
                        <span>{formatDate(file.lastUpdated)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="version-badge">v{file.version}</span>
                        <span className="file-size">{file.size}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="file-actions">
                    <button
                      onClick={() => handleFileSelect(file, 'left')}
                      className={`select-btn left ${leftFile?.id === file.id ? 'selected' : ''}`}
                      disabled={rightFile?.id === file.id}
                    >
                      เลือกเป็นไฟล์ที่ 1
                    </button>
                    <button
                      onClick={() => handleFileSelect(file, 'right')}
                      className={`select-btn right ${rightFile?.id === file.id ? 'selected' : ''}`}
                      disabled={leftFile?.id === file.id}
                    >
                      เลือกเป็นไฟล์ที่ 2
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileSelector;