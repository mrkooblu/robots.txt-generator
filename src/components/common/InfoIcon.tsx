'use client';

import React from 'react';
import styled from 'styled-components';
import { FaInfoCircle } from 'react-icons/fa';

interface InfoIconProps {
  size?: number;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const StyledInfoIcon = styled(FaInfoCircle)<{ $size: number }>`
  color: #6B7280; // Gray color matching screenshot
  cursor: help;
  vertical-align: middle;
  margin-left: 6px;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  transition: color 0.2s;
  
  &:hover {
    color: #3B82F6; // Blue on hover
  }
`;

const InfoIcon: React.FC<InfoIconProps> = ({
  size = 18,
  className,
  onClick
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) onClick(e);
  };

  return (
    <StyledInfoIcon 
      $size={size} 
      className={className}
      onClick={handleClick}
    />
  );
};

export default InfoIcon; 