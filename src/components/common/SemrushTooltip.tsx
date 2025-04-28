'use client';

import React from 'react';
import styled from 'styled-components';
import Tooltip from './Tooltip';
import InfoIcon from './InfoIcon';
import { theme } from '@/styles/theme';

interface SemrushTooltipProps {
  tip: string;
  semrushLink: string;
  linkText: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  size?: number;
  className?: string;
}

const TooltipContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  line-height: 1.6;
`;

const TipText = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: white;
`;

const SemrushLink = styled.a`
  color: #60A5FA; /* Light blue color from design */
  font-weight: 500;
  font-size: 12px;
  text-decoration: none;
  display: flex;
  align-items: center;
  margin-top: 4px;
  
  &:hover {
    text-decoration: underline;
    opacity: 0.9;
  }
  
  &::after {
    content: ' →';
    font-size: 14px;
    margin-left: 2px;
  }
`;

const SemrushTooltip: React.FC<SemrushTooltipProps> = ({
  tip,
  semrushLink,
  linkText,
  position = 'top',
  size = 18,
  className
}) => {
  const tooltipContent = (
    <TooltipContent>
      <TipText>{tip}</TipText>
      <SemrushLink 
        href={semrushLink} 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
      >
        {linkText}
      </SemrushLink>
    </TooltipContent>
  );
  
  return (
    <Tooltip 
      content={tooltipContent}
      position={position}
      maxWidth="300px"
      className={className}
    >
      <InfoIcon size={size} />
    </Tooltip>
  );
};

export default SemrushTooltip; 