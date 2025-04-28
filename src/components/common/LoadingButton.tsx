'use client';

import React from 'react';
import styled from 'styled-components';
import Button, { ButtonVariant, ButtonSize } from './Button';
import LoadingSpinner from './LoadingSpinner';

interface LoadingButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  size?: ButtonSize;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  isLoading = false,
  loadingText,
  onClick,
  variant = 'primary',
  fullWidth = false,
  size = 'md',
  disabled = false,
  type = 'button',
  className,
}) => {
  return (
    <Button
      onClick={isLoading ? undefined : onClick}
      variant={variant}
      fullWidth={fullWidth}
      size={size}
      disabled={disabled || isLoading}
      type={type}
      className={className}
    >
      {isLoading ? (
        <ButtonContent>
          <SpinnerWrapper>
            <LoadingSpinner size="small" color="currentColor" />
          </SpinnerWrapper>
          {loadingText || children}
        </ButtonContent>
      ) : (
        children
      )}
    </Button>
  );
};

export default LoadingButton; 