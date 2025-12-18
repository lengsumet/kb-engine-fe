import React from 'react';

const SimpleAIIcon = ({ size = 24, className = '', style = {} }) => {
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
        strokeWidth="2"
        fill="none"
      />
      
      {/* Simple AI representation - hexagon with center dot */}
      <g stroke="currentColor" strokeWidth="1.5" fill="none">
        {/* Hexagon shape */}
        <polygon 
          points="12,7 15,9.5 15,14.5 12,17 9,14.5 9,9.5" 
          strokeWidth="1.2"
        />
        
        {/* Center dot */}
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </g>
    </svg>
  );
};

export default SimpleAIIcon;