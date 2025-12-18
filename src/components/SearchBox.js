import React, { useState } from 'react';
import { Search, Mic, Filter, X } from 'lucide-react';
import './SearchBox.css';

const SearchBox = ({ onSearch, onFilterChange, filters = {} }) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(filters);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query, activeFilters);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...activeFilters, [filterType]: value };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
    onFilterChange({});
  };

  const categories = [
    { value: 'hr', label: 'นโยบาย HR' },
    { value: 'credit', label: 'นโยบายสินเชื่อ' },
    { value: 'it', label: 'คู่มือ IT' },
    { value: 'operation', label: 'คู่มือปฏิบัติงาน' },
    { value: 'compliance', label: 'กฎระเบียบ' }
  ];

  const fileTypes = [
    { value: 'pdf', label: 'PDF' },
    { value: 'image', label: 'รูปภาพ' },
    { value: 'video', label: 'วิดีโอ' },
    { value: 'document', label: 'เอกสาร' }
  ];

  return (
    <div className="search-box">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาข้อมูล เอกสาร หรือคำแนะนำ... (รองรับภาษาพูดและคำศัพท์เฉพาะ)"
            className="search-input"
          />
          <button type="button" className="voice-search-btn" title="ค้นหาด้วยเสียง">
            <Mic size={18} />
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`filter-btn ${showFilters ? 'active' : ''}`}
            title="ตัวกรอง"
          >
            <Filter size={18} />
          </button>
        </div>
        <button type="submit" className="search-submit-btn">
          ค้นหา
        </button>
      </form>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-header">
            <h3>ตัวกรองการค้นหา</h3>
            <button onClick={clearFilters} className="clear-filters-btn">
              <X size={16} />
              ล้างตัวกรอง
            </button>
          </div>

          <div className="filter-group">
            <label>หมวดหมู่</label>
            <select
              value={activeFilters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">ทั้งหมด</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>ประเภทไฟล์</label>
            <select
              value={activeFilters.fileType || ''}
              onChange={(e) => handleFilterChange('fileType', e.target.value)}
            >
              <option value="">ทั้งหมด</option>
              {fileTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>วันที่อัปเดต</label>
            <select
              value={activeFilters.dateRange || ''}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            >
              <option value="">ทั้งหมด</option>
              <option value="today">วันนี้</option>
              <option value="week">สัปดาห์นี้</option>
              <option value="month">เดือนนี้</option>
              <option value="quarter">ไตรมาสนี้</option>
              <option value="year">ปีนี้</option>
              <option value="custom">กำหนดช่วงเวลาเอง</option>
            </select>
          </div>

          {activeFilters.dateRange === 'custom' && (
            <div className="date-range-inputs">
              <div className="filter-group">
                <label>จากวันที่</label>
                <input
                  type="date"
                  value={activeFilters.startDate || ''}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="date-input"
                />
              </div>
              <div className="filter-group">
                <label>ถึงวันที่</label>
                <input
                  type="date"
                  value={activeFilters.endDate || ''}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="date-input"
                />
              </div>
            </div>
          )}

          <div className="filter-group">
            <label>เปรียบเทียบข้อมูลระหว่างปี</label>
            <div className="year-comparison">
              <select
                value={activeFilters.compareYear1 || ''}
                onChange={(e) => handleFilterChange('compareYear1', e.target.value)}
                className="year-select"
              >
                <option value="">เลือกปีที่ 1</option>
                <option value="2567">2567</option>
                <option value="2568">2568</option>
                <option value="2569">2569</option>
                <option value="2570">2570</option>
              </select>
              <span className="vs-text">เทียบกับ</span>
              <select
                value={activeFilters.compareYear2 || ''}
                onChange={(e) => handleFilterChange('compareYear2', e.target.value)}
                className="year-select"
              >
                <option value="">เลือกปีที่ 2</option>
                <option value="2567">2567</option>
                <option value="2568">2568</option>
                <option value="2569">2569</option>
                <option value="2570">2570</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBox;