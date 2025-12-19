import { useState } from 'react';
import { Filter, SortAsc, SortDesc, Calendar, FileType, Tag, X } from 'lucide-react';
import './SearchFilters.css';

const SearchFilters = ({ 
  filters = {}, 
  onFilterChange, 
  onSortChange,
  sortBy = 'relevance',
  sortOrder = 'desc',
  totalResults = 0 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState(filters);

  const categories = [
    { value: 'all', label: 'ทั้งหมด' },
    { value: 'hr', label: 'นโยบาย HR' },
    { value: 'credit', label: 'นโยบายสินเชื่อ' },
    { value: 'it', label: 'คู่มือ IT' },
    { value: 'operation', label: 'คู่มือปฏิบัติงาน' },
    { value: 'compliance', label: 'กฎระเบียบ' }
  ];

  const fileTypes = [
    { value: 'all', label: 'ทุกประเภท' },
    { value: 'pdf', label: 'PDF' },
    { value: 'doc', label: 'Word' },
    { value: 'excel', label: 'Excel' },
    { value: 'ppt', label: 'PowerPoint' },
    { value: 'image', label: 'รูปภาพ' }
  ];

  const dateRanges = [
    { value: 'all', label: 'ทุกช่วงเวลา' },
    { value: '7days', label: '7 วันที่ผ่านมา' },
    { value: '30days', label: '30 วันที่ผ่านมา' },
    { value: '3months', label: '3 เดือนที่ผ่านมา' },
    { value: '1year', label: '1 ปีที่ผ่านมา' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'ความเกี่ยวข้อง' },
    { value: 'date', label: 'วันที่อัปเดต' },
    { value: 'title', label: 'ชื่อเอกสาร' },
    { value: 'category', label: 'หมวดหมู่' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...activeFilters, [key]: value };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilter = (key) => {
    const newFilters = { ...activeFilters };
    delete newFilters[key];
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    onFilterChange({});
  };

  const getActiveFiltersCount = () => {
    return Object.values(activeFilters).filter(value => 
      value && value !== '' && value !== 'all'
    ).length;
  };

  const handleSortChange = (newSortBy) => {
    if (newSortBy === sortBy) {
      // Toggle sort order if same field
      onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to desc
      onSortChange(newSortBy, 'desc');
    }
  };

  return (
    <div className="search-filters">
      <div className="filters-header">
        <div className="filters-toggle">
          <button 
            className={`toggle-btn ${isExpanded ? 'active' : ''}`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Filter size={16} />
            <span>ตัวกรอง</span>
            {getActiveFiltersCount() > 0 && (
              <span className="filter-count">{getActiveFiltersCount()}</span>
            )}
          </button>
        </div>

        <div className="sort-controls">
          <span className="sort-label">เรียงตาม:</span>
          <div className="sort-options">
            {sortOptions.map(option => (
              <button
                key={option.value}
                className={`sort-btn ${sortBy === option.value ? 'active' : ''}`}
                onClick={() => handleSortChange(option.value)}
              >
                {option.label}
                {sortBy === option.value && (
                  sortOrder === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="results-count">
          <span>{totalResults.toLocaleString('th-TH')} ผลลัพธ์</span>
        </div>
      </div>

      {isExpanded && (
        <div className="filters-content">
          <div className="filters-grid">
            {/* Category Filter */}
            <div className="filter-group">
              <label className="filter-label">
                <Tag size={16} />
                หมวดหมู่
              </label>
              <select 
                value={activeFilters.category || 'all'}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="filter-select"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* File Type Filter */}
            <div className="filter-group">
              <label className="filter-label">
                <FileType size={16} />
                ประเภทไฟล์
              </label>
              <select 
                value={activeFilters.fileType || 'all'}
                onChange={(e) => handleFilterChange('fileType', e.target.value)}
                className="filter-select"
              >
                {fileTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="filter-group">
              <label className="filter-label">
                <Calendar size={16} />
                ช่วงเวลา
              </label>
              <select 
                value={activeFilters.dateRange || 'all'}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="filter-select"
              >
                {dateRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {getActiveFiltersCount() > 0 && (
            <div className="active-filters">
              <span className="active-filters-label">ตัวกรองที่ใช้:</span>
              <div className="active-filters-list">
                {Object.entries(activeFilters).map(([key, value]) => {
                  if (!value || value === 'all') return null;
                  
                  let label = value;
                  if (key === 'category') {
                    label = categories.find(c => c.value === value)?.label || value;
                  } else if (key === 'fileType') {
                    label = fileTypes.find(t => t.value === value)?.label || value;
                  } else if (key === 'dateRange') {
                    label = dateRanges.find(d => d.value === value)?.label || value;
                  }

                  return (
                    <button
                      key={key}
                      className="active-filter-tag"
                      onClick={() => clearFilter(key)}
                    >
                      {label}
                      <X size={14} />
                    </button>
                  );
                })}
                <button className="clear-all-btn" onClick={clearAllFilters}>
                  ล้างทั้งหมด
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilters;