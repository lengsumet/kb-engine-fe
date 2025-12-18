import React from 'react';

const AIIcon = ({ size = 24, className = '', style = {} }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {/* Outer circle */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      
      {/* AI Brain pattern - simplified neural network */}
      <g stroke="currentColor" strokeWidth="1.2" fill="none">
        {/* Central node */}
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        
        {/* Top nodes */}
        <circle cx="8" cy="8" r="1" fill="currentColor" />
        <circle cx="16" cy="8" r="1" fill="currentColor" />
        
        {/* Bottom nodes */}
        <circle cx="8" cy="16" r="1" fill="currentColor" />
        <circle cx="16" cy="16" r="1" fill="currentColor" />
        
        {/* Connections */}
        <line x1="12" y1="12" x2="8" y2="8" strokeWidth="0.8" opacity="0.7" />
        <line x1="12" y1="12" x2="16" y2="8" strokeWidth="0.8" opacity="0.7" />
        <line x1="12" y1="12" x2="8" y2="16" strokeWidth="0.8" opacity="0.7" />
        <line x1="12" y1="12" x2="16" y2="16" strokeWidth="0.8" opacity="0.7" />
        
        {/* Cross connections */}
        <line x1="8" y1="8" x2="16" y2="16" strokeWidth="0.6" opacity="0.4" />
        <line x1="16" y1="8" x2="8" y2="16" strokeWidth="0.6" opacity="0.4" />
      </g>
      
      {/* AI indicator dots */}
      <g fill="currentColor">
        <circle cx="6" cy="12" r="0.8" opacity="0.6" />
        <circle cx="18" cy="12" r="0.8" opacity="0.6" />
      </g>
    </svg>
  );
};

export default AIIcon;