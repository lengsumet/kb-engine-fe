import React from 'react';
import { Clock, Search, TrendingUp } from 'lucide-react';
import './RecentSearches.css';

const RecentSearches = ({ onSearchSelect }) => {
  const recentSearches = [
    { query: 'นโยบายการลา', timestamp: '2024-01-15T10:30:00', results: 12 },
    { query: 'ขั้นตอนการอนุมัติสินเชื่อ', timestamp: '2024-01-15T09:15:00', results: 8 },
    { query: 'แก้ไขปัญหาระบบ', timestamp: '2024-01-14T16:45:00', results: 15 },
    { query: 'กฎระเบียบใหม่', timestamp: '2024-01-14T14:20:00', results: 6 }
  ];

  const popularSearches = [
    { query: 'คู่มือการใช้งานระบบใหม่', count: 156 },
    { query: 'นโยบายโบนัสประจำปี', count: 134 },
    { query: 'ขั้นตอนการขออนุมัติ', count: 98 },
    { query: 'การแก้ไขข้อมูลลูกค้า', count: 87 },
    { query: 'มาตรฐานการให้บริการ', count: 76 }
  ];

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInHours = Math.floor((now - past) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'เมื่อสักครู่';
    if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`;
    return `${Math.floor(diffInHours / 24)} วันที่แล้ว`;
  };

  const handleSearchClick = (query) => {
    onSearchSelect(query, {});
  };

  return (
    <div className="recent-searches">
      <div className="searches-container">
        <div className="recent-section">
          <div className="section-header">
            <Clock size={20} />
            <h3>การค้นหาล่าสุด</h3>
          </div>
          
          <div className="search-list">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleSearchClick(search.query)}
                className="search-item"
              >
                <div className="search-content">
                  <span className="search-query">{search.query}</span>
                  <div className="search-meta">
                    <span className="search-time">{formatTimeAgo(search.timestamp)}</span>
                    <span className="search-results">{search.results} ผลลัพธ์</span>
                  </div>
                </div>
                <Search size={16} className="search-icon" />
              </button>
            ))}
          </div>
        </div>

        <div className="popular-section">
          <div className="section-header">
            <TrendingUp size={20} />
            <h3>คำค้นหายอดนิยม</h3>
          </div>
          
          <div className="search-list">
            {popularSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleSearchClick(search.query)}
                className="search-item popular"
              >
                <div className="search-content">
                  <span className="search-query">{search.query}</span>
                  <div className="search-meta">
                    <span className="search-count">{search.count} ครั้ง</span>
                  </div>
                </div>
                <div className="popularity-rank">
                  #{index + 1}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentSearches;