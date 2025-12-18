import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SearchResults from '../components/SearchResults';

const CategoryBrowser = () => {
  const { category } = useParams();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryDocuments = async () => {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockDocuments = [
        {
          id: 1,
          title: 'นโยบายการลาพักร้อนประจำปี 2024',
          content: 'นโยบายการลาพักร้อนสำหรับพนักงานทุกระดับ',
          category: category,
          fileType: 'pdf',
          lastUpdated: '2024-01-15',
          relevanceScore: 0.95,
          searchType: 'category',
          highlights: []
        }
      ];
      
      setDocuments(mockDocuments);
      setLoading(false);
    };

    fetchCategoryDocuments();
  }, [category]);

  return (
    <div style={{ padding: '2rem' }}>
      <SearchResults 
        results={documents}
        loading={loading}
        query={`หมวดหมู่: ${category}`}
        filters={{ category }}
      />
    </div>
  );
};

export default CategoryBrowser;