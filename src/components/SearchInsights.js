import { TrendingUp, Users, Clock, Lightbulb, ArrowRight } from 'lucide-react';
import './SearchInsights.css';

const SearchInsights = ({ 
  query, 
  results = [], 
  onSuggestionClick,
  searchHistory = [] 
}) => {
  // Generate insights based on search results
  const generateInsights = () => {
    const insights = [];
    
    if (results.length === 0) {
      insights.push({
        type: 'suggestion',
        icon: Lightbulb,
        title: 'ลองคำค้นหาอื่น',
        description: 'ใช้คำศัพท์ที่เกี่ยวข้องหรือคำพ้อง',
        suggestions: [
          `${query} คู่มือ`,
          `${query} นโยบาย`,
          `${query} ขั้นตอน`,
          `วิธีการ ${query}`
        ]
      });
    } else {
      // Category distribution
      const categories = {};
      results.forEach(result => {
        categories[result.category] = (categories[result.category] || 0) + 1;
      });
      
      const topCategory = Object.entries(categories)
        .sort(([,a], [,b]) => b - a)[0];
      
      if (topCategory) {
        insights.push({
          type: 'category',
          icon: TrendingUp,
          title: `หมวดหมู่ยอดนิยม: ${getCategoryLabel(topCategory[0])}`,
          description: `พบ ${topCategory[1]} เอกสารในหมวดหมู่นี้`,
          action: () => onSuggestionClick && onSuggestionClick(query, { category: topCategory[0] })
        });
      }
      
      // High relevance results
      const highRelevanceCount = results.filter(r => r.relevanceScore > 0.8).length;
      if (highRelevanceCount > 0) {
        insights.push({
          type: 'quality',
          icon: Users,
          title: 'ผลลัพธ์คุณภาพสูง',
          description: `พบ ${highRelevanceCount} เอกสารที่เกี่ยวข้องสูง`,
          highlight: true
        });
      }
      
      // Recent updates
      const recentCount = results.filter(r => {
        const updateDate = new Date(r.lastUpdated);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return updateDate > thirtyDaysAgo;
      }).length;
      
      if (recentCount > 0) {
        insights.push({
          type: 'freshness',
          icon: Clock,
          title: 'เอกสารใหม่',
          description: `${recentCount} เอกสารอัปเดตใน 30 วันที่ผ่านมา`
        });
      }
    }
    
    return insights;
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

  const insights = generateInsights();

  if (insights.length === 0) return null;

  return (
    <div className="search-insights">
      <div className="insights-header">
        <h3>ข้อมูลเชิงลึก</h3>
        <span className="insights-count">{insights.length} รายการ</span>
      </div>
      
      <div className="insights-grid">
        {insights.map((insight, index) => {
          const IconComponent = insight.icon;
          
          return (
            <div 
              key={index} 
              className={`insight-card ${insight.type} ${insight.highlight ? 'highlight' : ''}`}
              onClick={insight.action}
              style={{ cursor: insight.action ? 'pointer' : 'default' }}
            >
              <div className="insight-icon">
                <IconComponent size={20} />
              </div>
              
              <div className="insight-content">
                <h4 className="insight-title">{insight.title}</h4>
                <p className="insight-description">{insight.description}</p>
                
                {insight.suggestions && (
                  <div className="insight-suggestions">
                    {insight.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        className="suggestion-tag"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSuggestionClick && onSuggestionClick(suggestion);
                        }}
                      >
                        {suggestion}
                        <ArrowRight size={12} />
                      </button>
                    ))}
                  </div>
                )}
                
                {insight.action && (
                  <div className="insight-action">
                    <ArrowRight size={16} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchInsights;