'use client';

import React from 'react';
import styled from 'styled-components';
import { FaInfoCircle } from 'react-icons/fa';
import { theme } from '@/styles/theme';

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

const TooltipBox = styled.div`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translate(-50%, -100%);
  background-color: #1F2937;
  color: white;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 14px;
  width: 280px;
  z-index: 10;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  
  ${InfoIcon}:hover + & {
    opacity: 1;
    visibility: visible;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -6px;
    border-width: 6px;
    border-style: solid;
    border-color: #1F2937 transparent transparent transparent;
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
  return (
    <TipContainer className={className}>
      <TipHeading>
        {heading}
        <InfoIcon />
        <TooltipBox>
          <TipText>{tip}</TipText>
          <SemrushLink 
            href={semrushLink} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            {linkText}
          </SemrushLink>
        </TooltipBox>
      </TipHeading>
    </TipContainer>
  );
};

export default SemrushTabTip; 