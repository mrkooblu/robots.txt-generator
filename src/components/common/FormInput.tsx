'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface FormInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  onValidate?: (value: string) => { valid: boolean; message?: string };
  required?: boolean;
  className?: string;
}

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  width: 100%;
`;

const Label = styled.label<{ $hasError: boolean; $required: boolean }>`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  color: ${props => props.$hasError ? '#e53e3e' : props.theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 4px;
  
  &::after {
    content: ${props => props.$required ? '"*"' : '""'};
    color: #e53e3e;
  }
`;

const Input = styled.input<{ $hasError: boolean }>`
  padding: 10px 12px;
  border: 1px solid ${props => props.$hasError ? '#e53e3e' : props.theme.colors.border};
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
  transition: all 0.2s;
  min-height: 44px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#e53e3e' : props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.$hasError ? 'rgba(229, 62, 62, 0.2)' : 'rgba(59, 130, 246, 0.2)'};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 16px; /* Prevent zoom on iOS */
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 12px;
  margin-top: 4px;
`;

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  onValidate,
  required = false,
  className,
}) => {
  const [localError, setLocalError] = useState<string | undefined>(error);
  
  // Update local error when prop changes
  useEffect(() => {
    setLocalError(error);
  }, [error]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Validate on change if validator provided
    if (onValidate) {
      const result = onValidate(newValue);
      if (!result.valid) {
        setLocalError(result.message);
      } else {
        setLocalError(undefined);
      }
    }
  };
  
  const handleBlur = () => {
    // Validate on blur if validator provided
    if (onValidate && value) {
      const result = onValidate(value);
      if (!result.valid) {
        setLocalError(result.message);
      } else {
        setLocalError(undefined);
      }
    }
    
    // Check required field on blur
    if (required && !value.trim()) {
      setLocalError('This field is required');
    }
  };
  
  return (
    <InputContainer className={className}>
      {label && (
        <Label $hasError={!!localError} $required={required}>
          {label}
        </Label>
      )}
      <Input
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        $hasError={!!localError}
        required={required}
      />
      {localError && <ErrorMessage>{localError}</ErrorMessage>}
    </InputContainer>
  );
};

export default FormInput; 