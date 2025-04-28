'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  maxWidth?: string;
  className?: string;
  touchFriendly?: boolean;
}

const TooltipContainer = styled.div`
  position: relative;
  display: inline-flex;
`;

const TooltipTrigger = styled.div`
  display: inline-flex;
  cursor: help;
`;

const TooltipContent = styled.div<{
  $position: 'top' | 'right' | 'bottom' | 'left';
  $visible: boolean;
  $maxWidth: string;
  $top: number;
  $left: number;
}>`
  position: fixed;
  background-color: #1E293B; /* Dark navy background */
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 9999;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  visibility: ${(props) => (props.$visible ? 'visible' : 'hidden')};
  transition: opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease;
  max-width: ${(props) => props.$maxWidth};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1);
  line-height: 1.6;
  text-align: left;
  white-space: normal;
  word-wrap: break-word;
  pointer-events: none;
  top: ${props => props.$top}px;
  left: ${props => props.$left}px;
  transform: ${props => {
    switch (props.$position) {
      case 'top':
        return 'translate(-50%, -100%) translateY(-10px)';
      case 'right':
        return 'translateY(-50%) translateX(10px)';
      case 'bottom':
        return 'translate(-50%, 0) translateY(10px)';
      case 'left':
        return 'translateY(-50%) translateX(-10px)';
      default:
        return '';
    }
  }};
  
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px 14px;
  }
  
  &::after {
    content: '';
    position: absolute;
    border-width: 8px;
    border-style: solid;
    
    ${props => {
      switch (props.$position) {
        case 'top':
          return `
            border-color: #1E293B transparent transparent transparent;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
          `;
        case 'right':
          return `
            border-color: transparent #1E293B transparent transparent;
            top: 50%;
            left: 0;
            transform: translateY(-50%) translateX(-100%);
          `;
        case 'bottom':
          return `
            border-color: transparent transparent #1E293B transparent;
            top: 0;
            left: 50%;
            transform: translateX(-50%) translateY(-100%);
          `;
        case 'left':
          return `
            border-color: transparent transparent transparent #1E293B;
            top: 50%;
            right: 0;
            transform: translateY(-50%) translateX(100%);
          `;
        default:
          return '';
      }
    }}
  }
`;

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 100,
  maxWidth = '280px',
  className,
  touchFriendly = true,
}) => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    return () => setIsMounted(false);
  }, []);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      let top, left;

      switch (position) {
        case 'top':
          top = rect.top;
          left = rect.left + rect.width / 2;
          break;
        case 'right':
          top = rect.top + rect.height / 2;
          left = rect.right;
          break;
        case 'bottom':
          top = rect.bottom;
          left = rect.left + rect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2;
          left = rect.left;
          break;
        default:
          top = rect.top;
          left = rect.left + rect.width / 2;
      }

      setTooltipPosition({ top, left });
    }
  };

  const showTooltip = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    updatePosition();
    timerRef.current = setTimeout(() => {
      setVisible(true);
    }, isTouchDevice ? 0 : delay);
  };

  const hideTooltip = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setVisible(false);
    }, 50);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation();
    showTooltip();
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    hideTooltip();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (touchFriendly && isTouchDevice) {
      updatePosition();
      setVisible(!visible);
    }
  };

  // If JS is disabled, hide the tooltip 
  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <TooltipContainer className={className}>
      <TooltipTrigger
        ref={triggerRef}
        onMouseEnter={!isTouchDevice ? handleMouseEnter : undefined}
        onMouseLeave={!isTouchDevice ? handleMouseLeave : undefined}
        onTouchStart={touchFriendly ? handleTouchStart : undefined}
        onClick={(e) => touchFriendly && e.stopPropagation()}
      >
        {children}
      </TooltipTrigger>
      
      <TooltipContent
        $position={position}
        $visible={visible}
        $maxWidth={maxWidth}
        $top={tooltipPosition.top}
        $left={tooltipPosition.left}
      >
        {content}
      </TooltipContent>
    </TooltipContainer>
  );
};

export default Tooltip; 