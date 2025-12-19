import { useState } from 'react';
import SearchBox from '../components/SearchBox';
import SearchResults from '../components/SearchResults';
import QuickAccess from '../components/QuickAccess';
import RecentSearches from '../components/RecentSearches';
import PopularContent from '../components/PopularContent';

import searchService from '../services/searchService';
import { LayoutGrid, List } from 'lucide-react';
import './SearchPage.css';

const SearchPage = ({ onOpenChat }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});

  
  // Simple view options
  const [viewMode] = useState('comfortable'); // compact, comfortable, spacious
  const [layoutMode, setLayoutMode] = useState('list'); // list, grid, wide
  const [showSidebar] = useState(true);

  // Search function using the new API
  const handleSearch = async (query, searchFilters = {}) => {
    if (loading || !query || query.trim() === '') return;

    setLoading(true);
    setSearchQuery(query);
    setHasSearched(true);

    try {
      // Check if this is a year comparison search
      if (searchFilters.compareYear1 && searchFilters.compareYear2) {
        // Mock comparison data (keep existing comparison logic)
        const mockComparisonData = [
          {
            title: 'วันหยุดปีใหม่',
            category: 'วันหยุดราชการ',
            type: 'unchanged',
            dates: {
              year1: '1 มกราคม 2568',
              year2: '1 มกราคม 2569'
            },
            description: 'วันหยุดปีใหม่ไม่มีการเปลี่ยนแปลง'
          },
          {
            title: 'วันสงกรานต์',
            category: 'วันหยุดราชการ',
            type: 'modified',
            dates: {
              year1: '13-15 เมษายน 2568',
              year2: '13-16 เมษายน 2569'
            },
            description: 'เพิ่มวันหยุดสงกรานต์ 1 วัน',
            changes: [
              'เพิ่มวันที่ 16 เมษายน เป็นวันหยุดเพิ่มเติม',
              'รวมวันหยุดสงกรานต์เป็น 4 วัน'
            ]
          },
          {
            title: 'วันหยุดพิเศษเฉลิมพระชนมพรรษา',
            category: 'วันหยุดพิเศษ',
            type: 'added',
            dates: {
              year1: null,
              year2: '28 กรกฎาคม 2569'
            },
            description: 'เพิ่มวันหยุดพิเศษใหม่',
            changes: [
              'ประกาศวันหยุดพิเศษเฉลิมพระชนมพรรษา',
              'วันหยุดชดเชยสำหรับพนักงาน'
            ]
          },
          {
            title: 'วันหยุดชดเชยโควิด-19',
            category: 'วันหยุดพิเศษ',
            type: 'removed',
            dates: {
              year1: '15 มีนาคม 2568',
              year2: null
            },
            description: 'ยกเลิกวันหยุดพิเศษโควิด-19',
            changes: [
              'ยกเลิกวันหยุดชดเชยโควิด-19',
              'กลับสู่ปฏิทินวันหยุดปกติ'
            ]
          }
        ];
        
        setSearchResults(mockComparisonData);
      } else {
        // Use mock search data
        const results = await searchService.performSearch(query, searchFilters);
        setSearchResults(results);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([{
        id: Date.now(),
        title: 'เกิดข้อผิดพลาดในการค้นหา',
        content: 'ไม่สามารถค้นหาข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง',
        category: 'error',
        fileType: 'error',
        lastUpdated: new Date().toLocaleDateString('th-TH'),
        relevanceScore: 0,
        searchType: 'error',
        highlights: [],
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    if (hasSearched && searchQuery && !loading) {
      handleSearch(searchQuery, newFilters);
    }
  };

  const handleQuickSearch = (query, quickFilters) => {
    setFilters(quickFilters || {});
    handleSearch(query, quickFilters || {});
  };

  const handlePopularContentClick = (content) => {
    if (content.title) {
      handleSearch(content.title);
    }
  };

  return (
    <div className={`search-page view-${viewMode} layout-${layoutMode} with-sidebar`}>
      
      {/* Simple Search Header */}
      <div className="search-header">
        <div className="container">
          <div className="search-intro">
            <h1>ค้นหา</h1>
          </div>
          
          {/* Search Box */}
          <div className="search-box-container">
            <SearchBox 
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              filters={filters}
            />
          </div>
        </div>
      </div>



      {/* Main Content */}
      <div className="search-main">
        <div className="container">
          <div className="search-layout">
            
            {/* Content Area */}
            <div className="search-content">
              {!hasSearched ? (
                <div className="search-welcome">
                  <div className="welcome-content">
                    <h2>เริ่มต้นการค้นหา</h2>
                    <p>พิมพ์คำค้นหาในช่องด้านบนเพื่อเริ่มค้นหาข้อมูล</p>
                  </div>
                </div>
              ) : (
                <div className="results-container">
                  {/* Layout Controls - Only show when there are results */}
                  {searchResults.length > 0 && !loading && (
                    <div className="results-controls">
                      <div className="layout-controls">
                        <button 
                          className={layoutMode === 'list' ? 'active' : ''}
                          onClick={() => setLayoutMode('list')}
                          title="รายการ"
                        >
                          <List size={16} />
                          <span>รายการ</span>
                        </button>
                        <button 
                          className={layoutMode === 'grid' ? 'active' : ''}
                          onClick={() => setLayoutMode('grid')}
                          title="ตาราง"
                        >
                          <LayoutGrid size={16} />
                          <span>ตาราง</span>
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <SearchResults 
                    results={searchResults}
                    loading={loading}
                    query={searchQuery}
                    filters={filters}
                    viewMode={viewMode}
                    layoutMode={layoutMode}
                    onNewSearch={(newQuery) => handleSearch(newQuery, filters)}
                  />
                </div>
              )}
            </div>

            {/* Always Show Sidebar - Moved under search-content */}
            <div className="search-sidebar">
              <div className="sidebar-section">
                <QuickAccess onQuickSearch={handleQuickSearch} />
              </div>
              
              <div className="sidebar-section">
                <RecentSearches onSearchSelect={handleSearch} />
              </div>
              
              <div className="sidebar-section">
                <PopularContent 
                  timeRange="7days"
                  onContentClick={handlePopularContentClick}
                />
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default SearchPage;