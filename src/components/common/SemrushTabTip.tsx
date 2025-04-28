'use client';

import React from 'react';
import styled from 'styled-components';
import { FaInfoCircle } from 'react-icons/fa';
import { theme } from '@/styles/theme';
import Tooltip from './Tooltip';

interface SemrushTabTipProps {
  heading: string;
  tip: string;
  semrushLink: string;
  linkText: string;
  className?: string;
}

const TipContainer = styled.div`
  position: relative;
  margin-top: 8px;
  display: flex;
  gap: 8px;
  align-items: center;
`;

const TipHeading = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #111827;
  display: flex;
  align-items: center;
`;

const InfoIcon = styled(FaInfoCircle)`
  margin-left: 8px;
  color: #3B82F6;
  cursor: help;
  font-size: 16px;
  
  &:hover {
    color: #2563EB;
  }
`;

const TipText = styled.p`
  margin: 0 0 8px 0;
  font-size: 14px;
  line-height: 1.5;
  color: white;
`;

const SemrushLink = styled.a`
  display: block;
  color: #60A5FA;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
    color: white;
  }
  
  &::after {
    content: ' →';
    font-size: 14px;
  }
`;

// A version of the tooltip that appears inline at the end of section headings
export const SemrushTabTip: React.FC<SemrushTabTipProps> = ({
  heading,
  tip,
  semrushLink,
  linkText,
  className
}) => {
  const tooltipContent = (
    <>
      <TipText>{tip}</TipText>
      <SemrushLink 
        href={semrushLink} 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
      >
        {linkText}
      </SemrushLink>
    </>
  );

  return (
    <TipContainer className={className}>
      <TipHeading>
        {heading}
        <Tooltip content={tooltipContent} position="top">
          <InfoIcon />
        </Tooltip>
      </TipHeading>
    </TipContainer>
  );
};

export default SemrushTabTip; 