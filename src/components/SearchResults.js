import { Link } from 'react-router-dom';
import { FileText, Image, Video, File, Clock, Star, Zap } from 'lucide-react';
import TimelineComparison from './TimelineComparison';
import RelatedQuestions from './RelatedQuestions';
import './SearchResults.css';

const SearchResults = ({ 
  results, 
  loading, 
  query, 
  filters, 
  viewMode = 'comfortable',
  layoutMode = 'list',
  onNewSearch 
}) => {
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf': return <FileText size={20} />;
      case 'image': return <Image size={20} />;
      case 'video': return <Video size={20} />;
      default: return <File size={20} />;
    }
  };

  const getSearchTypeIcon = (searchType) => {
    switch (searchType) {
      case 'semantic': return <Star size={16} className="search-type-icon semantic" />;
      case 'vector': return <Zap size={16} className="search-type-icon vector" />;
      case 'hybrid': return <Star size={16} className="search-type-icon hybrid" />;
      default: return null;
    }
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="search-results">
        <div className="search-loading">
          <div className="loading-spinner"></div>
          <p>กำลังค้นหาข้อมูล...</p>
        </div>
      </div>
    );
  }

  // Check if this is a year comparison search
  const isYearComparison = filters.compareYear1 && filters.compareYear2;

  return (
    <div className="search-results">
      {isYearComparison ? (
        <TimelineComparison 
          year1={filters.compareYear1}
          year2={filters.compareYear2}
          comparisonData={results}
          loading={loading}
        />
      ) : results.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">
            <FileText size={48} />
          </div>
          <h3>ไม่พบผลการค้นหา</h3>
          <p>ลองใช้คำค้นหาอื่น หรือปรับตัวกรองการค้นหา</p>
          <div className="search-suggestions">
            <h4>คำแนะนำ:</h4>
            <ul>
              <li>ใช้คำศัพท์ที่เกี่ยวข้องหรือคำพ้อง</li>
              <li>ลดจำนวนตัวกรองที่เลือก</li>
              <li>ตรวจสอบการสะกดคำ</li>
              <li>ใช้คำค้นหาที่สั้นและชัดเจน</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className={`results-list view-${viewMode} layout-${layoutMode}`}>
          {results.map((result) => (
            <div key={result.id} className="result-item">
              <div className="result-header">
                <div className="result-meta">
                  <div className="file-info">
                    {getFileIcon(result.fileType)}
                    <span className="file-type">{result.fileType.toUpperCase()}</span>
                  </div>
                  <div className="category-badge">
                    {getCategoryLabel(result.category)}
                  </div>
                  {getSearchTypeIcon(result.searchType)}
                </div>
              </div>

              <div className="result-content">
                {result.isError ? (
                  <div className="error-result">
                    <h3 className="result-title error-title">{result.title}</h3>
                    <p className="result-description error-description">{result.content}</p>
                  </div>
                ) : (
                  <>
                    <Link to={`/document/${result.id}`} className="result-title">
                      {result.title}
                    </Link>
                    <p className="result-description">{result.content}</p>
                  </>
                )}
                
                {result.highlights && result.highlights.length > 0 && (
                  <div className="result-highlights">
                    <span className="highlights-label">คำสำคัญ:</span>
                    {result.highlights.map((highlight, index) => (
                      <span key={index} className="highlight-tag">
                        {highlight}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="result-footer">
                <div className="result-date">
                  <Clock size={14} />
                  <span>อัปเดตล่าสุด: {formatDate(result.lastUpdated)}</span>
                </div>
                {!result.isError && (
                  <Link to={`/document/${result.id}`} className="view-document-btn">
                    ดูเอกสาร
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Related Questions - only show for regular searches with results */}
      {!isYearComparison && !loading && results.length > 0 && query && (
        <RelatedQuestions 
          query={query}
          onQuestionSelect={onNewSearch}
        />
      )}
    </div>
  );
};

export default SearchResults;