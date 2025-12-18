import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Image, Video, File, Clock, Star, Zap } from 'lucide-react';
import TimelineComparison from './TimelineComparison';
import AIAnswerBox from './AIAnswerBox';
import RelatedQuestions from './RelatedQuestions';
import './SearchResults.css';

const SearchResults = ({ results, loading, query, filters, onNewSearch }) => {
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
          <p>กำลังค้นหาด้วย AI Hybrid Search...</p>
        </div>
      </div>
    );
  }

  // Check if this is a year comparison search
  const isYearComparison = filters.compareYear1 && filters.compareYear2;

  return (
    <div className="search-results">
      <div className="results-header">
        <div className="results-info">
          <h2>{isYearComparison ? 'การเปรียบเทียบข้อมูลระหว่างปี' : 'ผลการค้นหา'}</h2>
          <p>
            {isYearComparison 
              ? `เปรียบเทียบข้อมูลระหว่างปี ${filters.compareYear1} และ ${filters.compareYear2}`
              : `พบ ${results.length} รายการสำหรับ "${query}"`
            }
          </p>
        </div>
        
        {results.length > 0 && (
          <div className="search-stats">
            <div className="stat-item">
              <span className="stat-label">Vector Search:</span>
              <span className="stat-value">{results.filter(r => r.searchType === 'vector').length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Semantic Search:</span>
              <span className="stat-value">{results.filter(r => r.searchType === 'semantic').length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Hybrid:</span>
              <span className="stat-value">{results.filter(r => r.searchType === 'hybrid').length}</span>
            </div>
          </div>
        )}
      </div>

      {/* AI Answer Box - only show for regular searches with results */}
      {!isYearComparison && !loading && results.length > 0 && query && (
        <AIAnswerBox 
          query={query}
          searchResults={results}
          loading={loading}
        />
      )}

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
        <div className="results-list">
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
                <div className="relevance-score">
                  <span className="score-label">ความเกี่ยวข้อง:</span>
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ width: `${result.relevanceScore * 100}%` }}
                    ></div>
                  </div>
                  <span className="score-value">{Math.round(result.relevanceScore * 100)}%</span>
                </div>
              </div>

              <div className="result-content">
                <Link to={`/document/${result.id}`} className="result-title">
                  {result.title}
                </Link>
                <p className="result-description">{result.content}</p>
                
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
                <Link to={`/document/${result.id}`} className="view-document-btn">
                  ดูเอกสาร
                </Link>
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