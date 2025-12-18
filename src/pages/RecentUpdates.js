import React, { useState, useEffect } from 'react';
import SearchResults from '../components/SearchResults';

const RecentUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentUpdates = async () => {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockUpdates = [
        {
          id: 1,
          title: 'อัปเดตนโยบายการทำงานจากที่บ้าน',
          content: 'นโยบายใหม่สำหรับการทำงานจากที่บ้านหลังสถานการณ์โควิด',
          category: 'hr',
          fileType: 'pdf',
          lastUpdated: '2024-01-15',
          relevanceScore: 1.0,
          searchType: 'recent',
          highlights: ['ใหม่', 'อัปเดต']
        }
      ];
      
      setUpdates(mockUpdates);
      setLoading(false);
    };

    fetchRecentUpdates();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <SearchResults 
        results={updates}
        loading={loading}
        query="อัปเดตล่าสุด"
        filters={{}}
      />
    </div>
  );
};

export default RecentUpdates;