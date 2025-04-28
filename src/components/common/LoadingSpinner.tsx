'use client';

import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div<{ $size: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => {
    switch (props.$size) {
      case 'small': return '16px';
      case 'large': return '32px';
      default: return '24px';
    }
  }};
  height: ${props => {
    switch (props.$size) {
      case 'small': return '16px';
      case 'large': return '32px';
      default: return '24px';
    }
  }};
`;

const SpinnerCircle = styled.div<{ $size: string; $color: string }>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: ${props => {
    switch (props.$size) {
      case 'small': return '2px';
      case 'large': return '4px';
      default: return '3px';
    }
  }} solid rgba(0, 0, 0, 0.1);
  border-top-color: ${props => props.$color};
  animation: ${spin} 0.8s linear infinite;
`;

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#3B82F6',
  className,
}) => {
  return (
    <SpinnerContainer $size={size} className={className}>
      <SpinnerCircle $size={size} $color={color} />
    </SpinnerContainer>
  );
};

export default LoadingSpinner; 