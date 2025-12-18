import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileSelector from '../components/FileSelector';
import FileComparison from '../components/FileComparison';
import './ComparisonPage.css';

const ComparisonPage = () => {
  const [currentView, setCurrentView] = useState('selector'); // 'selector' or 'comparison'
  const [selectedFiles, setSelectedFiles] = useState({ left: null, right: null });
  const navigate = useNavigate();

  const handleCompare = (leftFile, rightFile) => {
    setSelectedFiles({ left: leftFile, right: rightFile });
    setCurrentView('comparison');
  };

  const handleBackToSelector = () => {
    setCurrentView('selector');
    setSelectedFiles({ left: null, right: null });
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="comparison-page">
      {currentView === 'selector' ? (
        <FileSelector 
          onCompare={handleCompare}
          onClose={handleClose}
        />
      ) : (
        <FileComparison
          leftFile={selectedFiles.left}
          rightFile={selectedFiles.right}
          onClose={handleBackToSelector}
        />
      )}
    </div>
  );
};

export default ComparisonPage;