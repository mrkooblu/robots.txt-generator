'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SemrushTip from './SemrushTip';
import { TipTrigger } from '@/data/TipsData';
import { theme } from '@/styles/theme';
import { FaLightbulb } from 'react-icons/fa';

interface TipWidgetProps {
  currentContext?: TipTrigger;
  className?: string;
}

const WidgetContainer = styled.div`
  position: fixed;
  right: ${theme.spacing.md};
  top: 160px;
  width: 280px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.lg}) {
    position: static;
    width: 100%;
    margin-top: ${theme.spacing.lg};
  }
`;

const TipsTitle = styled.div`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fonts.weights.semibold};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const TipIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.primary};
`;

const ToggleButton = styled.button`
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: fixed;
  right: ${theme.spacing.md};
  top: 100px;
  box-shadow: ${theme.shadows.md};
  z-index: 11;
  transition: ${theme.transition.default};
  
  &:hover {
    background-color: ${theme.colors.hover};
    transform: scale(1.05);
  }
  
  @media (min-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

const TipWidget: React.FC<TipWidgetProps> = ({ 
  currentContext = 'general',
  className 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [tipTriggers, setTipTriggers] = useState<TipTrigger[]>(['general']);
  
  // Update tips based on context
  useEffect(() => {
    // Always show a general tip
    const triggers: TipTrigger[] = ['general'];
    
    // Add the context-specific tip if it's not 'general'
    if (currentContext !== 'general') {
      triggers.push(currentContext);
    }
    
    setTipTriggers(triggers);
  }, [currentContext]);
  
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  
  return (
    <>
      <ToggleButton onClick={toggleVisibility}>
        <FaLightbulb />
      </ToggleButton>
      
      {isVisible && (
        <WidgetContainer className={className}>
          <TipsTitle>
            <TipIconWrapper>
              <FaLightbulb />
            </TipIconWrapper>
            SEO Tips
          </TipsTitle>
          
          {tipTriggers.map((trigger, index) => (
            <SemrushTip 
              key={`${trigger}-${index}`}
              trigger={trigger}
              autoRotate={true}
              interval={45000 + (index * 15000)} // Stagger the rotation
            />
          ))}
        </WidgetContainer>
      )}
    </>
  );
};

export default TipWidget; 