import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import './SearchBox.css';

const SearchBox = ({ 
  onSearch, 
  onFilterChange, 
  filters = {}, 
  autoSearch = true, 
  enableVoice = true, 
  searchMode = 'hybrid' 
}) => {
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
            placeholder="ค้นหาข้อมูล"
            className="search-input"
          />
        </div>
        <button type="submit" className="search-submit-btn">
          ค้นหา
        </button>
      </form>
    </div>
  );
};

export default SearchBox;