import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Eye, Clock, Calendar, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { getPopularDocuments } from '../data/mockSearchData';
import './PopularContent.css';

const PopularContent = ({ timeRange = '7days', onContentClick }) => {
  const [popularContent, setPopularContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState(timeRange);

  useEffect(() => {
    loadPopularContent();
  }, [selectedRange]);

  const loadPopularContent = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get popular documents from mock data
      const docs = getPopularDocuments(8);
      const mockData = docs.map((doc, index) => ({
        ...doc,
        trend: index % 3 === 0 ? 'up' : index % 3 === 1 ? 'down' : 'same',
        trendValue: index % 3 === 0 ? Math.floor(Math.random() * 20) + 10 : 
                     index % 3 === 1 ? -Math.floor(Math.random() * 10) - 5 : 0,
        lastViewed: new Date(Date.now() - (index + 1) * 3600000).toISOString(),
        description: `เอกสารเกี่ยวกับ${doc.title}`,
        tags: [doc.category, 'เอกสาร', 'ยอดนิยม']
      }));
      
      setPopularContent(mockData);
    } catch (error) {
      console.error('Error loading popular content:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockPopularContent = (range) => {
    const baseContent = [
      {
        id: 1,
        title: 'นโยบายการลาพักร้อนประจำปี 2024',
        category: 'hr',
        views: 1250,
        trend: 'up',
        trendValue: 15,
        lastViewed: '2024-01-15T14:30:00',
        description: 'นโยบายการลาพักร้อนที่อัปเดตใหม่',
        tags: ['นโยบาย', 'การลา', 'HR']
      },
      {
        id: 2,
        title: 'คู่มือการใช้งานระบบสินเชื่อใหม่',
        category: 'credit',
        views: 980,
        trend: 'up',
        trendValue: 25,
        lastViewed: '2024-01-15T13:45:00',
        description: 'คู่มือการใช้งานระบบสินเชื่อเวอร์ชันใหม่',
        tags: ['สินเชื่อ', 'ระบบใหม่', 'คู่มือ']
      },
      {
        id: 3,
        title: 'วิธีแก้ไขปัญหาระบบ IT เบื้องต้น',
        category: 'it',
        views: 756,
        trend: 'down',
        trendValue: -8,
        lastViewed: '2024-01-15T12:20:00',
        description: 'คู่มือแก้ไขปัญหาระบบคอมพิวเตอร์',
        tags: ['IT', 'แก้ไขปัญหา', 'คอมพิวเตอร์']
      },
      {
        id: 4,
        title: 'ขั้นตอนการเบิกค่าใช้จ่าย',
        category: 'operation',
        views: 645,
        trend: 'up',
        trendValue: 12,
        lastViewed: '2024-01-15T11:15:00',
        description: 'ขั้นตอนการเบิกค่าใช้จ่ายต่างๆ',
        tags: ['การเบิก', 'ค่าใช้จ่าย', 'ขั้นตอน']
      },
      {
        id: 5,
        title: 'กฎระเบียบความปลอดภัยในการทำงาน',
        category: 'compliance',
        views: 523,
        trend: 'same',
        trendValue: 0,
        lastViewed: '2024-01-15T10:30:00',
        description: 'กฎระเบียบเกี่ยวกับความปลอดภัย',
        tags: ['ความปลอดภัย', 'กฎระเบียบ', 'การทำงาน']
      },
      {
        id: 6,
        title: 'แบบฟอร์มคำขอต่างๆ',
        category: 'hr',
        views: 445,
        trend: 'up',
        trendValue: 18,
        lastViewed: '2024-01-15T09:45:00',
        description: 'รวมแบบฟอร์มคำขอที่ใช้บ่อย',
        tags: ['แบบฟอร์ม', 'คำขอ', 'เอกสาร']
      },
      {
        id: 7,
        title: 'วันหยุดประจำปี 2024',
        category: 'hr',
        views: 389,
        trend: 'down',
        trendValue: -5,
        lastViewed: '2024-01-15T08:30:00',
        description: 'ปฏิทินวันหยุดประจำปี 2024',
        tags: ['วันหยุด', 'ปฏิทิน', '2024']
      },
      {
        id: 8,
        title: 'นโยบายโบนัสประจำปี',
        category: 'hr',
        views: 334,
        trend: 'up',
        trendValue: 22,
        lastViewed: '2024-01-15T07:15:00',
        description: 'เกณฑ์การจ่ายโบนัสประจำปี',
        tags: ['โบนัส', 'เงินเดือน', 'สวัสดิการ']
      }
    ];

    // Adjust data based on time range
    if (range === '1day') {
      return baseContent.slice(0, 5).map(item => ({
        ...item,
        views: Math.floor(item.views * 0.3),
        trendValue: Math.floor(item.trendValue * 0.5)
      }));
    } else if (range === '30days') {
      return baseContent.map(item => ({
        ...item,
        views: Math.floor(item.views * 2.5),
        trendValue: Math.floor(item.trendValue * 1.8)
      }));
    }

    return baseContent;
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <ArrowUp size={14} className="trend-icon up" />;
      case 'down':
        return <ArrowDown size={14} className="trend-icon down" />;
      default:
        return <Minus size={14} className="trend-icon same" />;
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'hr': 'HR',
      'credit': 'สินเชื่อ',
      'it': 'IT',
      'operation': 'ปฏิบัติงาน',
      'compliance': 'กฎระเบียบ'
    };
    return labels[category] || category;
  };

  const formatViews = (views) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInHours = Math.floor((now - past) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'เมื่อสักครู่';
    if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`;
    return `${Math.floor(diffInHours / 24)} วันที่แล้ว`;
  };

  const handleContentClick = (content) => {
    if (onContentClick) {
      onContentClick(content);
    }
  };

  const timeRanges = [
    { value: '1day', label: 'วันนี้' },
    { value: '7days', label: '7 วันที่แล้ว' },
    { value: '30days', label: '30 วันที่แล้ว' }
  ];

  if (loading) {
    return (
      <div className="popular-content loading">
        <div className="loading-header">
          <div className="loading-skeleton title"></div>
          <div className="loading-skeleton subtitle"></div>
        </div>
        <div className="loading-list">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="loading-item">
              <div className="loading-skeleton content"></div>
              <div className="loading-skeleton meta"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="popular-content">
      <div className="content-header">
        <div className="header-title">
          <TrendingUp size={24} />
          <div>
            <h2>เนื้อหายอดนิยม</h2>
            <p>เอกสารและข้อมูลที่เข้าชมมากที่สุด</p>
          </div>
        </div>
        
        <div className="time-range-selector">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setSelectedRange(range.value)}
              className={`range-btn ${selectedRange === range.value ? 'active' : ''}`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="content-list">
        {popularContent.map((content, index) => (
          <div key={content.id} className="content-item">
            <div className="content-rank">
              <span className="rank-number">#{index + 1}</span>
            </div>
            
            <div className="content-info">
              <Link 
                to={`/document/${content.id}`}
                onClick={() => handleContentClick(content)}
                className="content-title"
              >
                {content.title}
              </Link>
              
              <p className="content-description">{content.description}</p>
              
              <div className="content-meta">
                <div className="meta-item">
                  <span className="category-badge">{getCategoryLabel(content.category)}</span>
                </div>
                
                <div className="meta-item">
                  <Eye size={14} />
                  <span>{formatViews(content.views)} ครั้ง</span>
                </div>
                
                <div className="meta-item">
                  <Clock size={14} />
                  <span>{formatTimeAgo(content.lastViewed)}</span>
                </div>
              </div>
              
              <div className="content-tags">
                {content.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="content-trend">
              <div className="trend-indicator">
                {getTrendIcon(content.trend)}
                {content.trendValue !== 0 && (
                  <span className={`trend-value ${content.trend}`}>
                    {Math.abs(content.trendValue)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="content-footer">
        <p className="update-info">
          <Calendar size={14} />
          <span>อัปเดตล่าสุด: {new Date().toLocaleDateString('th-TH')}</span>
        </p>
      </div>
    </div>
  );
};

export default PopularContent;