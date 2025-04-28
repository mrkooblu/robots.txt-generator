'use client';

import React from 'react';
import styled from 'styled-components';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  borderRadius?: string;
  interactive?: boolean;
  onClick?: () => void;
}

const StyledCard = styled.div<{
  $padding: string,
  $borderRadius: string,
  $interactive: boolean,
}>`
  background-color: ${props => props.theme.colors.background.card};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.$borderRadius};
  padding: ${props => props.$padding};
  box-shadow: ${props => props.theme.shadows.card};
  transition: all ${props => props.theme.transition.default};
  color: ${props => props.theme.colors.text.primary};
  width: 100%;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.$padding === '24px' ? '16px' : props.$padding};
    border-radius: ${props => props.$borderRadius === '12px' ? '8px' : props.$borderRadius};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.$padding === '24px' ? '12px' : props.$padding};
  }
  
  @media (max-width: 320px) {
    padding: 12px 8px;
  }
  
  ${props => props.$interactive && `
    cursor: pointer;
    &:hover {
      box-shadow: ${props.theme.shadows.hover};
      transform: translateY(-2px);
    }
    &:active {
      transform: translateY(0);
    }
  `}
`;

const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = '24px',
  borderRadius = '12px',
  interactive = false,
  onClick,
}) => {
  return (
    <StyledCard
      className={className}
      $padding={padding}
      $borderRadius={borderRadius}
      $interactive={interactive}
      onClick={onClick}
    >
      {children}
    </StyledCard>
  );
};

export default Card;