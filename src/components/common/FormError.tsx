'use client';

import React from 'react';
import styled from 'styled-components';

interface FormErrorProps {
  message?: string;
  className?: string;
}

const ErrorText = styled.div`
  color: #e53e3e;
  font-size: 12px;
  margin-top: 4px;
  animation: fadeIn 0.2s ease-in;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-2px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const FormError: React.FC<FormErrorProps> = ({ message, className }) => {
  if (!message) return null;
  
  return (
    <ErrorText className={className}>
      {message}
    </ErrorText>
  );
};

export default FormError; 