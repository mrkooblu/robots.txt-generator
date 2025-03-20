'use client';

import React from 'react';
import styled from 'styled-components';
import Tooltip from './Tooltip';
import { FaInfoCircle } from 'react-icons/fa';
import { theme } from '@/styles/theme';

interface SemrushTooltipProps {
  tip: string;
  semrushLink: string;
  linkText: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  size?: number;
  className?: string;
}

const InfoIcon = styled(FaInfoCircle)`
  color: ${theme.colors.primary};
  margin-left: 6px;
  cursor: help;
  vertical-align: middle;
  
  &:hover {
    color: ${theme.colors.hover};
  }
`;

const TooltipContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TipText = styled.div`
  font-size: 13px;
  line-height: 1.5;
`;

const SemrushLink = styled.a`
  color: white;
  font-weight: 500;
  font-size: 12px;
  text-decoration: underline;
  display: flex;
  align-items: center;
  margin-top: 4px;
  
  &:hover {
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
  size = 16,
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