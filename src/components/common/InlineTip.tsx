'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaLightbulb, FaTimes } from 'react-icons/fa';
import { Tip, getRandomTip, TipTrigger } from '@/data/TipsData';
import { theme } from '@/styles/theme';

interface InlineTipProps {
  trigger: TipTrigger;
  className?: string;
  onClose?: () => void;
  autoDismiss?: boolean;
  dismissDelay?: number;
}

const TipContainer = styled.div`
  display: flex;
  background-color: ${theme.colors.background.secondary};
  border: 1px solid ${theme.colors.border};
  border-left: 3px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  margin: ${theme.spacing.sm} 0;
  align-items: center;
  gap: ${theme.spacing.md};
  position: relative;
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const IconWrapper = styled.div`
  color: ${theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TipContent = styled.div`
  flex: 1;
`;

const TipText = styled.p`
  margin: 0 0 ${theme.spacing.xs} 0;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.primary};
`;

const TipLink = styled.a`
  display: inline-block;
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fonts.weights.medium};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  flex-shrink: 0;
  
  &:hover {
    opacity: 1;
  }
`;

const InlineTip: React.FC<InlineTipProps> = ({
  trigger,
  className,
  onClose,
  autoDismiss = false,
  dismissDelay = 10000 // 10 seconds
}) => {
  const [visible, setVisible] = useState(true);
  const [tip, setTip] = useState<Tip | null>(null);
  
  useEffect(() => {
    // Get a random tip based on the trigger
    const newTip = getRandomTip(undefined, trigger);
    setTip(newTip);
    
    // Set up auto-dismiss timer if enabled
    if (autoDismiss) {
      const timer = setTimeout(() => {
        handleClose();
      }, dismissDelay);
      
      return () => clearTimeout(timer);
    }
  }, [trigger, autoDismiss, dismissDelay]);
  
  const handleClose = () => {
    setVisible(false);
    if (onClose) {
      onClose();
    }
  };
  
  if (!visible || !tip) {
    return null;
  }
  
  return (
    <TipContainer className={className}>
      <IconWrapper>
        <FaLightbulb />
      </IconWrapper>
      
      <TipContent>
        <TipText>{tip.text}</TipText>
        <TipLink 
          href={tip.link} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          {tip.linkText}
        </TipLink>
      </TipContent>
      
      <CloseButton onClick={handleClose}>
        <FaTimes />
      </CloseButton>
    </TipContainer>
  );
};

export default InlineTip; 