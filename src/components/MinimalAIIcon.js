import React from 'react';

const MinimalAIIcon = ({ size = 24, className = '', style = {} }) => {
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
      {/* Simple circle with AI pattern */}
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Minimal AI brain - just 3 connected dots */}
      <g fill="currentColor">
        {/* Top dot */}
        <circle cx="12" cy="9" r="1.2" />
        
        {/* Bottom left dot */}
        <circle cx="9" cy="15" r="1.2" />
        
        {/* Bottom right dot */}
        <circle cx="15" cy="15" r="1.2" />
      </g>
      
      {/* Connection lines */}
      <g stroke="currentColor" strokeWidth="1.5" opacity="0.7">
        <line x1="12" y1="9" x2="9" y2="15" />
        <line x1="12" y1="9" x2="15" y2="15" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </g>
    </svg>
  );
};

export default MinimalAIIcon;