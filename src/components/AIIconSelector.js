import React from 'react';
import AIIcon from './AIIcon';
import MinimalAIIcon from './MinimalAIIcon';
import SimpleAIIcon from './SimpleAIIcon';
import { MessageCircle, Bot } from 'lucide-react';

const AIIconSelector = ({ iconType = 'minimal', size = 24, className = '', style = {} }) => {
  const iconProps = { size, className, style };

  switch (iconType) {
    case 'detailed':
      return <AIIcon {...iconProps} />;
    case 'minimal':
      return <MinimalAIIcon {...iconProps} />;
    case 'simple':
      return <SimpleAIIcon {...iconProps} />;
    case 'bot':
      return <Bot {...iconProps} />;
    case 'message':
      return <MessageCircle {...iconProps} />;
    default:
      return <MinimalAIIcon {...iconProps} />;
  }
};

export default AIIconSelector;