import React from 'react';

const ChatIcon = ({ size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color: 'white' }}
    >
      {/* Simple chat bubble with AI dots */}
      <path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      
      {/* AI indicator dots */}
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="12" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
      
      {/* Connection lines to show AI */}
      <line x1="9" y1="10" x2="12" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <line x1="12" y1="10" x2="15" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
    </svg>
  );
};

export default ChatIcon;