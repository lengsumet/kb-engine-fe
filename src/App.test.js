import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import SearchBox from './components/SearchBox';
import SearchResults from './components/SearchResults';
import QuickAccess from './components/QuickAccess';
import FileSelector from './components/FileSelector';
import FileComparison from './components/FileComparison';
import AIAnswerBox from './components/AIAnswerBox';
import RelatedQuestions from './components/RelatedQuestions';

// Mock data for testing
const mockSearchResults = [
  {
    id: 1,
    title: 'นโยบายการลาพักร้อนประจำปี 2024',
    content: 'นโยบายการลาพักร้อนสำหรับพนักงานทุกระดับ',
    category: 'hr',
    fileType: 'pdf',
    lastUpdated: '2024-01-15',
    relevanceScore: 0.95,
    searchType: 'semantic',
    highlights: ['นโยบาย', 'การลา']
  }
];

// Helper function to render components with router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Knowledge Base Frontend Tests', () => {
  
  describe('App Component', () => {
    test('renders main application', () => {
      renderWithRouter(<App />);
      expect(screen.getByText('Knowledge Base')).toBeInTheDocument();
      expect(screen.getByText('ระบบฐานความรู้องค์กร')).toBeInTheDocument();
    });

    test('displays navigation menu', () => {
      renderWithRouter(<App />);
      expect(screen.getByText('ค้นหา')).toBeInTheDocument();
      expect(screen.getByText('หมวดหมู่')).toBeInTheDocument();
      expect(screen.getByText('อัปเดตล่าสุด')).toBeInTheDocument();
      expect(screen.getByText('เปรียบเทียบไฟล์')).toBeInTheDocument();
    });
  });

  describe('SearchBox Component', () => {
    const mockOnSearch = jest.fn();
    const mockOnFilterChange = jest.fn();

    beforeEach(() => {
      mockOnSearch.mockClear();
      mockOnFilterChange.mockClear();
    });

    test('renders search input and button', () => {
      render(
        <SearchBox 
          onSearch={mockOnSearch} 
          onFilterChange={mockOnFilterChange} 
        />
      );
      
      expect(screen.getByPlaceholderText(/ค้นหาข้อมูล เอกสาร/)).toBeInTheDocument();
      expect(screen.getByText('ค้นหา')).toBeInTheDocument();
    });

    test('handles search input and submission', async () => {
      render(
        <SearchBox 
          onSearch={mockOnSearch} 
          onFilterChange={mockOnFilterChange} 
        />
      );
      
      const searchInput = screen.getByPlaceholderText(/ค้นหาข้อมูล เอกสาร/);
      const searchButton = screen.getByText('ค้นหา');
      
      fireEvent.change(searchInput, { target: { value: 'นโยบายการลา' } });
      fireEvent.click(searchButton);
      
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('นโยบายการลา', {});
      });
    });

    test('shows and hides filter panel', () => {
      render(
        <SearchBox 
          onSearch={mockOnSearch} 
          onFilterChange={mockOnFilterChange} 
        />
      );
      
      const filterButton = screen.getByTitle('ตัวกรอง');
      fireEvent.click(filterButton);
      
      expect(screen.getByText('ตัวกรองการค้นหา')).toBeInTheDocument();
      expect(screen.getByText('หมวดหมู่')).toBeInTheDocument();
    });

    test('handles filter changes', async () => {
      render(
        <SearchBox 
          onSearch={mockOnSearch} 
          onFilterChange={mockOnFilterChange} 
        />
      );
      
      const filterButton = screen.getByTitle('ตัวกรอง');
      fireEvent.click(filterButton);
      
      const categorySelect = screen.getByDisplayValue('ทั้งหมด');
      fireEvent.change(categorySelect, { target: { value: 'hr' } });
      
      await waitFor(() => {
        expect(mockOnFilterChange).toHaveBeenCalledWith({ category: 'hr' });
      });
    });
  });

  describe('SearchResults Component', () => {
    test('displays loading state', () => {
      render(
        <SearchResults 
          results={[]} 
          loading={true} 
          query="test" 
          filters={{}} 
        />
      );
      
      expect(screen.getByText('กำลังค้นหาด้วย AI Hybrid Search...')).toBeInTheDocument();
    });

    test('displays search results', () => {
      renderWithRouter(
        <SearchResults 
          results={mockSearchResults} 
          loading={false} 
          query="นโยบาย" 
          filters={{}} 
        />
      );
      
      expect(screen.getByText('ผลการค้นหา')).toBeInTheDocument();
      expect(screen.getByText('พบ 1 รายการสำหรับ "นโยบาย"')).toBeInTheDocument();
      expect(screen.getByText('นโยบายการลาพักร้อนประจำปี 2024')).toBeInTheDocument();
    });

    test('displays no results message', () => {
      render(
        <SearchResults 
          results={[]} 
          loading={false} 
          query="ไม่มีผลลัพธ์" 
          filters={{}} 
        />
      );
      
      expect(screen.getByText('ไม่พบผลการค้นหา')).toBeInTheDocument();
      expect(screen.getByText('ลองใช้คำค้นหาอื่น หรือปรับตัวกรองการค้นหา')).toBeInTheDocument();
    });

    test('displays search statistics', () => {
      renderWithRouter(
        <SearchResults 
          results={mockSearchResults} 
          loading={false} 
          query="test" 
          filters={{}} 
        />
      );
      
      expect(screen.getByText('Vector Search:')).toBeInTheDocument();
      expect(screen.getByText('Semantic Search:')).toBeInTheDocument();
      expect(screen.getByText('Hybrid:')).toBeInTheDocument();
    });

    test('shows relevance score', () => {
      renderWithRouter(
        <SearchResults 
          results={mockSearchResults} 
          loading={false} 
          query="test" 
          filters={{}} 
        />
      );
      
      expect(screen.getByText('ความเกี่ยวข้อง:')).toBeInTheDocument();
      expect(screen.getByText('95%')).toBeInTheDocument();
    });
  });

  describe('QuickAccess Component', () => {
    test('renders category cards', () => {
      renderWithRouter(<QuickAccess />);
      
      expect(screen.getByText('เข้าถึงด่วน')).toBeInTheDocument();
      expect(screen.getByText('นโยบาย HR')).toBeInTheDocument();
      expect(screen.getByText('นโยบายสินเชื่อ')).toBeInTheDocument();
      expect(screen.getByText('คู่มือ IT')).toBeInTheDocument();
      expect(screen.getByText('คู่มือปฏิบัติงาน')).toBeInTheDocument();
      expect(screen.getByText('กฎระเบียบ')).toBeInTheDocument();
    });

    test('category cards are clickable', () => {
      renderWithRouter(<QuickAccess />);
      
      const hrCard = screen.getByText('นโยบาย HR').closest('a');
      expect(hrCard).toHaveAttribute('href', '/category/hr');
    });
  });

  describe('Hybrid Search Features', () => {
    test('supports vector search results', () => {
      const vectorResults = [{
        ...mockSearchResults[0],
        searchType: 'vector'
      }];
      
      renderWithRouter(
        <SearchResults 
          results={vectorResults} 
          loading={false} 
          query="test" 
          filters={{}} 
        />
      );
      
      expect(screen.getByText('1')).toBeInTheDocument(); // Vector search count
    });

    test('supports semantic search results', () => {
      const semanticResults = [{
        ...mockSearchResults[0],
        searchType: 'semantic'
      }];
      
      renderWithRouter(
        <SearchResults 
          results={semanticResults} 
          loading={false} 
          query="test" 
          filters={{}} 
        />
      );
      
      expect(screen.getByText('1')).toBeInTheDocument(); // Semantic search count
    });

    test('supports hybrid search results', () => {
      const hybridResults = [{
        ...mockSearchResults[0],
        searchType: 'hybrid'
      }];
      
      renderWithRouter(
        <SearchResults 
          results={hybridResults} 
          loading={false} 
          query="test" 
          filters={{}} 
        />
      );
      
      expect(screen.getByText('1')).toBeInTheDocument(); // Hybrid search count
    });
  });

  describe('Date Range and Timeline Features', () => {
    test('shows custom date range inputs when selected', () => {
      render(
        <SearchBox 
          onSearch={jest.fn()} 
          onFilterChange={jest.fn()} 
        />
      );
      
      const filterButton = screen.getByTitle('ตัวกรอง');
      fireEvent.click(filterButton);
      
      const dateRangeSelect = screen.getByDisplayValue('ทั้งหมด');
      fireEvent.change(dateRangeSelect, { target: { value: 'custom' } });
      
      expect(screen.getByText('จากวันที่')).toBeInTheDocument();
      expect(screen.getByText('ถึงวันที่')).toBeInTheDocument();
    });

    test('shows year comparison selects', () => {
      render(
        <SearchBox 
          onSearch={jest.fn()} 
          onFilterChange={jest.fn()} 
        />
      );
      
      const filterButton = screen.getByTitle('ตัวกรอง');
      fireEvent.click(filterButton);
      
      expect(screen.getByText('เปรียบเทียบข้อมูลระหว่างปี')).toBeInTheDocument();
      expect(screen.getByText('เลือกปีที่ 1')).toBeInTheDocument();
      expect(screen.getByText('เลือกปีที่ 2')).toBeInTheDocument();
    });

    test('displays timeline comparison when years are selected', () => {
      const mockComparisonData = [{
        title: 'วันหยุดปีใหม่',
        category: 'วันหยุดราชการ',
        type: 'unchanged',
        dates: { year1: '1 มกราคม 2568', year2: '1 มกราคม 2569' }
      }];

      renderWithRouter(
        <SearchResults 
          results={mockComparisonData} 
          loading={false} 
          query="วันหยุด" 
          filters={{ compareYear1: '2568', compareYear2: '2569' }} 
        />
      );
      
      expect(screen.getByText('การเปรียบเทียบข้อมูลระหว่างปี')).toBeInTheDocument();
      expect(screen.getByText('เปรียบเทียบข้อมูลระหว่างปี 2568 และ 2569')).toBeInTheDocument();
    });

    test('handles quick search for holiday comparison', () => {
      const mockOnQuickSearch = jest.fn();
      
      render(
        <QuickAccess onQuickSearch={mockOnQuickSearch} />
      );
      
      const holidayComparisonBtn = screen.getByText('เปรียบเทียบวันหยุด');
      fireEvent.click(holidayComparisonBtn);
      
      expect(mockOnQuickSearch).toHaveBeenCalledWith('วันหยุด', {
        compareYear1: '2568',
        compareYear2: '2569'
      });
    });

    test('shows file comparison link in quick actions', () => {
      renderWithRouter(
        <QuickAccess onQuickSearch={jest.fn()} />
      );
      
      expect(screen.getByText('เปรียบเทียบไฟล์')).toBeInTheDocument();
      expect(screen.getByText('เปรียบเทียบเอกสาร 2 ฉบับเพื่อดูความแตกต่าง')).toBeInTheDocument();
    });
  });

  describe('File Comparison Features', () => {
    test('renders file selector component', () => {
      const mockOnCompare = jest.fn();
      const mockOnClose = jest.fn();
      
      render(
        <FileSelector onCompare={mockOnCompare} onClose={mockOnClose} />
      );
      
      expect(screen.getByText('เลือกไฟล์เพื่อเปรียบเทียบ')).toBeInTheDocument();
      expect(screen.getByText('เลือกไฟล์ 2 ไฟล์เพื่อดูความแตกต่าง')).toBeInTheDocument();
    });

    test('shows file selection slots', () => {
      const mockOnCompare = jest.fn();
      const mockOnClose = jest.fn();
      
      render(
        <FileSelector onCompare={mockOnCompare} onClose={mockOnClose} />
      );
      
      expect(screen.getByText('ไฟล์ที่ 1 (เก่า)')).toBeInTheDocument();
      expect(screen.getByText('ไฟล์ที่ 2 (ใหม่)')).toBeInTheDocument();
      expect(screen.getByText('คลิกเลือกไฟล์จากรายการด้านล่าง')).toBeInTheDocument();
    });

    test('has search functionality in file selector', () => {
      const mockOnCompare = jest.fn();
      const mockOnClose = jest.fn();
      
      render(
        <FileSelector onCompare={mockOnCompare} onClose={mockOnClose} />
      );
      
      expect(screen.getByPlaceholderText('ค้นหาไฟล์...')).toBeInTheDocument();
      expect(screen.getByDisplayValue('ทุกหมวดหมู่')).toBeInTheDocument();
    });

    test('compare button is disabled when files not selected', () => {
      const mockOnCompare = jest.fn();
      const mockOnClose = jest.fn();
      
      render(
        <FileSelector onCompare={mockOnCompare} onClose={mockOnClose} />
      );
      
      const compareButton = screen.getByText('เปรียบเทียบไฟล์');
      expect(compareButton).toBeDisabled();
    });

    test('renders file comparison component with mock data', () => {
      const mockLeftFile = {
        id: 1,
        title: 'นโยบายการลาพักร้อน 2568',
        version: '1.0',
        lastUpdated: '2024-01-15T10:30:00Z'
      };
      
      const mockRightFile = {
        id: 2,
        title: 'นโยบายการลาพักร้อน 2569',
        version: '2.0',
        lastUpdated: '2024-12-01T14:20:00Z'
      };
      
      render(
        <FileComparison 
          leftFile={mockLeftFile}
          rightFile={mockRightFile}
          onClose={jest.fn()}
        />
      );
      
      expect(screen.getByText('กำลังโหลดและเปรียบเทียบไฟล์...')).toBeInTheDocument();
    });
  });

  describe('AI Answer Features', () => {
    test('renders AI answer box with mock data', () => {
      const mockResults = [mockSearchResults[0]];
      
      render(
        <AIAnswerBox 
          query="นโยบายการลา"
          searchResults={mockResults}
          loading={false}
        />
      );
      
      // Should show loading state initially
      expect(screen.getByText('AI กำลังสร้างคำตอบ...')).toBeInTheDocument();
    });

    test('shows related questions component', () => {
      const mockOnQuestionSelect = jest.fn();
      
      render(
        <RelatedQuestions 
          query="นโยบายการลา"
          onQuestionSelect={mockOnQuestionSelect}
        />
      );
      
      expect(screen.getByText('คำถามที่เกี่ยวข้อง')).toBeInTheDocument();
    });

    test('handles question selection in related questions', async () => {
      const mockOnQuestionSelect = jest.fn();
      
      render(
        <RelatedQuestions 
          query="นโยบายการลา"
          onQuestionSelect={mockOnQuestionSelect}
        />
      );
      
      // Wait for questions to load
      await waitFor(() => {
        const questionButtons = screen.getAllByRole('button');
        if (questionButtons.length > 0) {
          fireEvent.click(questionButtons[0]);
          expect(mockOnQuestionSelect).toHaveBeenCalled();
        }
      });
    });

    test('displays search results with AI answer box', () => {
      renderWithRouter(
        <SearchResults 
          results={mockSearchResults} 
          loading={false} 
          query="นโยบายการลา" 
          filters={{}}
          onNewSearch={jest.fn()}
        />
      );
      
      expect(screen.getByText('ผลการค้นหา')).toBeInTheDocument();
      // AI Answer Box should be rendered but in loading state
      expect(screen.getByText('AI กำลังสร้างคำตอบ...')).toBeInTheDocument();
    });
  });

  describe('Accessibility Features', () => {
    test('search input has proper labels', () => {
      render(
        <SearchBox 
          onSearch={jest.fn()} 
          onFilterChange={jest.fn()} 
        />
      );
      
      const searchInput = screen.getByPlaceholderText(/ค้นหาข้อมูล เอกสาร/);
      expect(searchInput).toBeInTheDocument();
    });

    test('buttons have proper titles', () => {
      render(
        <SearchBox 
          onSearch={jest.fn()} 
          onFilterChange={jest.fn()} 
        />
      );
      
      expect(screen.getByTitle('ค้นหาด้วยเสียง')).toBeInTheDocument();
      expect(screen.getByTitle('ตัวกรอง')).toBeInTheDocument();
    });

    test('results have proper heading structure', () => {
      renderWithRouter(
        <SearchResults 
          results={mockSearchResults} 
          loading={false} 
          query="test" 
          filters={{}} 
        />
      );
      
      expect(screen.getByRole('heading', { name: 'ผลการค้นหา' })).toBeInTheDocument();
    });
  });

  describe('Thai Language Support', () => {
    test('displays Thai text correctly', () => {
      renderWithRouter(<App />);
      
      expect(screen.getByText('ระบบฐานความรู้องค์กร')).toBeInTheDocument();
      expect(screen.getByText('ค้นหา')).toBeInTheDocument();
      expect(screen.getByText('หมวดหมู่')).toBeInTheDocument();
    });

    test('search placeholder supports Thai', () => {
      render(
        <SearchBox 
          onSearch={jest.fn()} 
          onFilterChange={jest.fn()} 
        />
      );
      
      expect(screen.getByPlaceholderText(/รองรับภาษาพูดและคำศัพท์เฉพาะ/)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('handles empty search results gracefully', () => {
      render(
        <SearchResults 
          results={[]} 
          loading={false} 
          query="ไม่มีผลลัพธ์" 
          filters={{}} 
        />
      );
      
      expect(screen.getByText('ไม่พบผลการค้นหา')).toBeInTheDocument();
      expect(screen.getByText('คำแนะนำ:')).toBeInTheDocument();
    });

    test('provides search suggestions when no results', () => {
      render(
        <SearchResults 
          results={[]} 
          loading={false} 
          query="test" 
          filters={{}} 
        />
      );
      
      expect(screen.getByText('ใช้คำศัพท์ที่เกี่ยวข้องหรือคำพ้อง')).toBeInTheDocument();
      expect(screen.getByText('ลดจำนวนตัวกรองที่เลือก')).toBeInTheDocument();
    });
  });
});