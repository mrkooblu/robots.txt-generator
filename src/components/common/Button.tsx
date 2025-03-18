'use client';

import React, { ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import { theme } from '@/styles/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
}

interface StyledButtonProps {
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
  $hasIcon: boolean;
  $iconPosition: 'left' | 'right';
  $isLoading?: boolean;
}

const getBackgroundColor = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary':
      return theme.colors.primary;
    case 'secondary':
      return '#E1EFFE';
    case 'outline':
      return 'transparent';
    case 'danger':
      return '#EF4444';
    case 'success':
      return '#10B981';
    default:
      return theme.colors.primary;
  }
};

const getHoverColor = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary':
      return '#2563EB';
    case 'secondary':
      return '#C7D9FB';
    case 'outline':
      return '#F3F4F6';
    case 'danger':
      return '#DC2626';
    case 'success':
      return '#059669';
    default:
      return '#2563EB';
  }
};

const getBorderColor = (variant: ButtonVariant) => {
  switch (variant) {
    case 'outline':
      return theme.colors.border;
    case 'secondary':
      return '#BFDBFE';
    default:
      return 'transparent';
  }
};

const getTextColor = (variant: ButtonVariant) => {
  switch (variant) {
    case 'outline':
      return theme.colors.primary;
    case 'secondary':
      return theme.colors.primary;
    default:
      return '#FFFFFF';
  }
};

const getPadding = (size: ButtonSize) => {
  switch (size) {
    case 'sm':
      return '6px 12px';
    case 'md':
      return '8px 16px';
    case 'lg':
      return '12px 24px';
    default:
      return '8px 16px';
  }
};

const getFontSize = (size: ButtonSize) => {
  switch (size) {
    case 'sm':
      return theme.fontSizes.sm;
    case 'md':
      return theme.fontSizes.md;
    case 'lg':
      return theme.fontSizes.lg;
    default:
      return theme.fontSizes.md;
  }
};

const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.fonts.weights.medium};
  transition: ${theme.transition.default};
  cursor: pointer;
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  flex-direction: ${props => props.$iconPosition === 'right' ? 'row-reverse' : 'row'};
  gap: ${theme.spacing.sm};
  
  ${({ $variant = 'primary' }) => css`
    background-color: ${getBackgroundColor($variant)};
    border: 1px solid ${getBorderColor($variant)};
    color: ${getTextColor($variant)};
    
    &:hover:not(:disabled) {
      background-color: ${getHoverColor($variant)};
    }
  `}
  
  ${({ $size = 'md' }) => css`
    padding: ${getPadding($size)};
    font-size: ${getFontSize($size)};
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }
  
  ${({ $isLoading }) => $isLoading && css`
    position: relative;
    color: transparent;
    
    &::after {
      content: "";
      position: absolute;
      width: 16px;
      height: 16px;
      top: 50%;
      left: 50%;
      margin: -8px 0 0 -8px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `}
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  disabled = false,
  className,
  isLoading = false,
  ...rest
}) => {
  return (
    <StyledButton
      type={type}
      onClick={onClick}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $hasIcon={!!icon}
      $iconPosition={iconPosition}
      $isLoading={isLoading}
      disabled={disabled || isLoading}
      className={className}
      {...rest}
    >
      {icon}
      {children}
    </StyledButton>
  );
};

export default Button; 