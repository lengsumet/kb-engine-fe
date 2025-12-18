import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SearchPage from './pages/SearchPage';
import DocumentViewer from './pages/DocumentViewer';
import CategoryBrowser from './pages/CategoryBrowser';
import RecentUpdates from './pages/RecentUpdates';
import ComparisonPage from './pages/ComparisonPage';
import Chatbot from './components/Chatbot/Chatbot';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/document/:id" element={<DocumentViewer />} />
            <Route path="/category/:category" element={<CategoryBrowser />} />
            <Route path="/updates" element={<RecentUpdates />} />
            <Route path="/compare" element={<ComparisonPage />} />
          </Routes>
        </main>
        <Chatbot apiEndpoint="/api/chat" />
      </div>
    </Router>
  );
}

export default App;