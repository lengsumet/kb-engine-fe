import React from 'react';
import { Clock, Search, TrendingUp } from 'lucide-react';
import { getRecentSearches } from '../data/mockSearchData';
import './RecentSearches.css';

const RecentSearches = ({ onSearchSelect }) => {
  const recentSearches = getRecentSearches().map((query, index) => ({
    query,
    timestamp: new Date(Date.now() - (index + 1) * 3600000).toISOString(), // Hours ago
    results: Math.floor(Math.random() * 20) + 5
  }));

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