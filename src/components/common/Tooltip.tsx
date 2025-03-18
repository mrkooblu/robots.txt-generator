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
  background-color: #2D3748;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  z-index: 9999;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  visibility: ${(props) => (props.$visible ? 'visible' : 'hidden')};
  transition: opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease;
  max-width: ${(props) => props.$maxWidth};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  line-height: 1.5;
  text-align: left;
  white-space: normal;
  word-wrap: break-word;
  pointer-events: none;
  top: ${props => props.$top}px;
  left: ${props => props.$left}px;
  transform: ${props => {
    switch (props.$position) {
      case 'top':
        return 'translate(-50%, -100%) translateY(-8px)';
      case 'right':
        return 'translateY(-50%) translateX(8px)';
      case 'bottom':
        return 'translate(-50%, 0) translateY(8px)';
      case 'left':
        return 'translateY(-50%) translateX(-8px)';
      default:
        return '';
    }
  }};
  
  @media (max-width: 768px) {
    font-size: 13px;
    padding: 6px 10px;
  }
  
  &::after {
    content: '';
    position: absolute;
    border-width: 6px;
    border-style: solid;
    
    ${props => {
      switch (props.$position) {
        case 'top':
          return `
            border-color: #2D3748 transparent transparent transparent;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
          `;
        case 'right':
          return `
            border-color: transparent #2D3748 transparent transparent;
            top: 50%;
            right: 100%;
            transform: translateY(-50%);
          `;
        case 'bottom':
          return `
            border-color: transparent transparent #2D3748 transparent;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
          `;
        case 'left':
          return `
            border-color: transparent transparent transparent #2D3748;
            top: 50%;
            left: 100%;
            transform: translateY(-50%);
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
    if (!touchFriendly) return;
    e.stopPropagation();
    showTooltip();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchFriendly) return;
    e.stopPropagation();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setVisible(false);
    }, 1000);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (visible) {
        updatePosition();
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', updatePosition);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [visible]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setVisible(false);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (isTouchDevice && window.innerWidth < 768) {
        if (position === 'left' || position === 'right') {
          updatePosition();
        }
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position, isTouchDevice]);

  return (
    <TooltipContainer className={className}>
      <TooltipTrigger
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </TooltipTrigger>
      {isMounted && visible && typeof document !== 'undefined' && createPortal(
        <TooltipContent 
          $position={position} 
          $visible={visible} 
          $maxWidth={maxWidth}
          $top={tooltipPosition.top}
          $left={tooltipPosition.left}
        >
          {content}
        </TooltipContent>,
        document.body
      )}
    </TooltipContainer>
  );
};

export default Tooltip; 