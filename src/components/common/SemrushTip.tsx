'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaLightbulb, FaTimes } from 'react-icons/fa';
import { theme } from '@/styles/theme';
import { Tip, getRandomTip, TipTrigger } from '@/data/TipsData';

interface SemrushTipProps {
  trigger?: TipTrigger;
  className?: string;
  autoRotate?: boolean;
  interval?: number;
}

const TipContainer = styled.div`
  background-color: ${theme.colors.background.secondary};
  border: 1px solid ${theme.colors.border};
  border-left: 3px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
  position: relative;
  box-shadow: ${theme.shadows.sm};
  transition: ${theme.transition.default};
  max-width: 100%;
  
  &:hover {
    box-shadow: ${theme.shadows.md};
  }
`;

const TipHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${theme.spacing.sm};
  color: ${theme.colors.primary};
  font-weight: ${theme.fonts.weights.semibold};
  font-size: ${theme.fontSizes.sm};
`;

const LightbulbIcon = styled(FaLightbulb)`
  margin-right: ${theme.spacing.sm};
  font-size: ${theme.fontSizes.md};
`;

const TipContent = styled.p`
  margin: 0 0 ${theme.spacing.sm} 0;
  color: ${theme.colors.text.primary};
  font-size: ${theme.fontSizes.sm};
  line-height: 1.5;
`;

const TipLink = styled.a`
  display: inline-block;
  color: ${theme.colors.primary};
  font-weight: ${theme.fonts.weights.medium};
  font-size: ${theme.fontSizes.sm};
  text-decoration: none;
  transition: ${theme.transition.default};
  margin-top: ${theme.spacing.xs};
  
  &:hover {
    color: ${theme.colors.hover};
    text-decoration: underline;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  background: transparent;
  border: none;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  font-size: ${theme.fontSizes.sm};
  opacity: 0.7;
  transition: ${theme.transition.default};
  
  &:hover {
    opacity: 1;
    color: ${theme.colors.text.primary};
  }
`;

export const SemrushTip: React.FC<SemrushTipProps> = ({ 
  trigger = 'general',
  className,
  autoRotate = false,
  interval = 30000 // 30 seconds
}) => {
  const [currentTip, setCurrentTip] = useState<Tip | null>(null);
  const [visible, setVisible] = useState(true);

  // Get a new random tip based on the trigger
  const refreshTip = () => {
    const newTip = getRandomTip(undefined, trigger);
    setCurrentTip(newTip);
    setVisible(true);
  };

  // Initialize with a tip
  useEffect(() => {
    refreshTip();
  }, [trigger]);

  // Set up auto-rotation if enabled
  useEffect(() => {
    if (autoRotate && visible) {
      const timer = setInterval(() => {
        refreshTip();
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [autoRotate, interval, visible]);

  if (!currentTip || !visible) {
    return null;
  }

  return (
    <TipContainer className={className}>
      <CloseButton onClick={() => setVisible(false)}>
        <FaTimes />
      </CloseButton>
      
      <TipHeader>
        <LightbulbIcon />
        Did You Know?
      </TipHeader>
      
      <TipContent>{currentTip.text}</TipContent>
      
      <TipLink href={currentTip.link} target="_blank" rel="noopener noreferrer">
        {currentTip.linkText}
      </TipLink>
    </TipContainer>
  );
};

export default SemrushTip; 