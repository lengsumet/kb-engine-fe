import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SearchPage from './pages/SearchPage';
import LoadingSpinner from './components/LoadingSpinner';
import PerformanceMonitor from './components/PerformanceMonitor';
import InteractiveChat from './components/InteractiveChat';
import ChatTestPage from './pages/ChatTestPage';
import IconDemo from './pages/IconDemo';
import LeavePage from './pages/LeavePage';
import { 
  LazyDocumentViewer,
  LazyCategoryBrowser,
  LazyRecentUpdates,
  LazyComparisonPage,
  preloadCriticalComponents
} from './utils/lazyLoading';
import './styles/design-system.css';
import './App.css';

// Import test utility for development
if (process.env.NODE_ENV === 'development') {
  import('./utils/testSearchAPI');
}

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialQuery, setChatInitialQuery] = useState('');

  useEffect(() => {
    // Preload critical components after initial render
    preloadCriticalComponents();
  }, []);

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleOpenChatWithQuery = (query) => {
    setChatInitialQuery(query);
    setIsChatOpen(true);
  };

  return (
    <Router>
      <div className="App">
        <PerformanceMonitor />
        <Header onOpenChat={handleOpenChatWithQuery} />
        <main className="main-content">
          <Suspense fallback={<LoadingSpinner message="กำลังโหลดหน้า..." />}>
            <Routes>
              <Route path="/" element={<SearchPage onOpenChat={handleOpenChatWithQuery} />} />
              <Route path="/chat-test" element={<ChatTestPage />} />
              <Route path="/icon-demo" element={<IconDemo />} />
              <Route path="/document/:id" element={<LazyDocumentViewer />} />
              <Route path="/leave/:id" element={<LeavePage />} />
              <Route path="/category/:category" element={<LazyCategoryBrowser />} />
              <Route path="/updates" element={<LazyRecentUpdates />} />
              <Route path="/compare" element={<LazyComparisonPage />} />
            </Routes>
          </Suspense>
        </main>
        
        {/* Interactive Chat */}
        <InteractiveChat 
          isOpen={isChatOpen}
          onToggle={handleChatToggle}
          initialQuery={chatInitialQuery}
        />
      </div>
    </Router>
  );
}

export default App;