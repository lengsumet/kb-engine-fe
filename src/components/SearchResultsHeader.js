import { Search, Clock, Target, Zap } from 'lucide-react';
import './SearchResultsHeader.css';

const SearchResultsHeader = ({ 
  query, 
  totalResults, 
  searchTime, 
  filters,
  searchType = 'hybrid'
}) => {
  const getSearchTypeInfo = (type) => {
    switch (type) {
      case 'semantic':
        return { icon: Target, label: 'ค้นหาตามความหมาย', color: '#10b981' };
      case 'vector':
        return { icon: Zap, label: 'ค้นหาขั้นสูง', color: '#f59e0b' };
      case 'hybrid':
        return { icon: Search, label: 'ค้นหาแบบผสมผสาน', color: '#8b5cf6' };
      default:
        return { icon: Search, label: 'ค้นหาทั่วไป', color: '#64748b' };
    }
  };

  const searchTypeInfo = getSearchTypeInfo(searchType);
  const SearchTypeIcon = searchTypeInfo.icon;

  const formatSearchTime = (time) => {
    if (time < 1000) return `${time} มิลลิวินาที`;
    return `${(time / 1000).toFixed(2)} วินาที`;
  };

  const getActiveFiltersCount = () => {
    if (!filters) return 0;
    return Object.values(filters).filter(value => 
      value && value !== '' && value !== 'all'
    ).length;
  };

  return (
    <div className="search-results-header">
      <div className="search-summary">
        <div className="search-query-info">
          <h2 className="search-title">
            ผลการค้นหาสำหรับ: <span className="query-text">"{query}"</span>
          </h2>
          <div className="search-meta">
            <div className="search-type-badge">
              <SearchTypeIcon size={16} style={{ color: searchTypeInfo.color }} />
              <span>{searchTypeInfo.label}</span>
            </div>
            {getActiveFiltersCount() > 0 && (
              <div className="filters-badge">
                <span className="filters-count">{getActiveFiltersCount()}</span>
                <span>ตัวกรองที่ใช้</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="search-stats">
          <div className="stat-item">
            <div className="stat-icon">
              <Search size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{totalResults.toLocaleString('th-TH')}</div>
              <div className="stat-label">ผลลัพธ์</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <Clock size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{formatSearchTime(searchTime)}</div>
              <div className="stat-label">เวลาค้นหา</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <Target size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {totalResults > 0 ? Math.round((totalResults / 1000) * 100) : 0}%
              </div>
              <div className="stat-label">ความแม่นยำ</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search Quality Indicator */}
      <div className="search-quality">
        <div className="quality-bar">
          <div 
            className="quality-fill" 
            style={{ 
              width: `${Math.min(100, (totalResults / 10) * 100)}%`,
              background: totalResults > 5 ? '#10b981' : totalResults > 2 ? '#f59e0b' : '#ef4444'
            }}
          ></div>
        </div>
        <span className="quality-label">
          {totalResults > 5 ? 'ผลลัพธ์ดีเยี่ยม' : 
           totalResults > 2 ? 'ผลลัพธ์ดี' : 
           totalResults > 0 ? 'ผลลัพธ์น้อย' : 'ไม่พบผลลัพธ์'}
        </span>
      </div>
    </div>
  );
};

export default SearchResultsHeader;