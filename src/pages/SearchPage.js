import React, { useState, useEffect } from 'react';
import SearchBox from '../components/SearchBox';
import SearchResults from '../components/SearchResults';
import QuickAccess from '../components/QuickAccess';
import RecentSearches from '../components/RecentSearches';
import './SearchPage.css';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});

  // Mock search function - replace with actual API call
  const handleSearch = async (query, searchFilters = {}) => {
    setLoading(true);
    setSearchQuery(query);
    setHasSearched(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if this is a year comparison search
      if (searchFilters.compareYear1 && searchFilters.compareYear2) {
        // Mock comparison data
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
        // Regular search results
        const mockResults = [
          {
            id: 1,
            title: 'นโยบายการลาพักร้อนประจำปี 2024',
            content: 'นโยบายการลาพักร้อนสำหรับพนักงานทุกระดับ รวมถึงเงื่อนไขและขั้นตอนการขออนุมัติ',
            category: 'hr',
            fileType: 'pdf',
            lastUpdated: '2024-01-15',
            relevanceScore: 0.95,
            searchType: 'semantic',
            highlights: ['นโยบายการลา', 'พักร้อน', 'พนักงาน']
          },
          {
            id: 2,
            title: 'คู่มือการใช้งานระบบสินเชื่อ V2.1',
            content: 'คู่มือการใช้งานระบบสินเชื่อใหม่ รวมถึงขั้นตอนการอนุมัติและการตรวจสอบเครดิต',
            category: 'credit',
            fileType: 'pdf',
            lastUpdated: '2024-01-10',
            relevanceScore: 0.88,
            searchType: 'vector',
            highlights: ['ระบบสินเชื่อ', 'อนุมัติ', 'เครดิต']
          },
          {
            id: 3,
            title: 'วิธีการแก้ไขปัญหาระบบ IT เบื้องต้น',
            content: 'คู่มือการแก้ไขปัญหาระบบคอมพิวเตอร์และเครือข่ายเบื้องต้นสำหรับพนักงาน',
            category: 'it',
            fileType: 'document',
            lastUpdated: '2024-01-08',
            relevanceScore: 0.82,
            searchType: 'hybrid',
            highlights: ['แก้ไขปัญหา', 'ระบบ IT', 'คอมพิวเตอร์']
          }
        ];

        // Filter results based on search filters
        let filteredResults = mockResults;
        if (searchFilters.category) {
          filteredResults = filteredResults.filter(r => r.category === searchFilters.category);
        }
        if (searchFilters.fileType) {
          filteredResults = filteredResults.filter(r => r.fileType === searchFilters.fileType);
        }

        setSearchResults(filteredResults);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    if (hasSearched && searchQuery) {
      handleSearch(searchQuery, newFilters);
    }
  };

  const handleQuickSearch = (query, quickFilters) => {
    setFilters(quickFilters);
    handleSearch(query, quickFilters);
  };

  return (
    <div className="search-page">
      <div className="search-hero">
        <div className="container">
          <div className="hero-content">
            <h1>ค้นหาข้อมูลและเอกสาร</h1>
            <p>ระบบค้นหาอัจฉริยะที่รองรับภาษาธรรมชาติและคำศัพท์เฉพาะองค์กร</p>
          </div>
          
          <SearchBox 
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            filters={filters}
          />
        </div>
      </div>

      <div className="search-content">
        <div className="container">
          {!hasSearched ? (
            <div className="search-landing">
              <QuickAccess onQuickSearch={handleQuickSearch} />
              <RecentSearches onSearchSelect={handleSearch} />
            </div>
          ) : (
            <SearchResults 
              results={searchResults}
              loading={loading}
              query={searchQuery}
              filters={filters}
              onNewSearch={(newQuery) => handleSearch(newQuery, filters)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;