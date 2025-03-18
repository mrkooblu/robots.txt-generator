'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';

interface SyntaxValidatorProps {
  robotsTxt: string;
}

const Container = styled.div`
  margin-top: 16px;
`;

const ValidationMessage = styled.div<{ $status: 'success' | 'error' | 'warning' }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 12px;
  background-color: ${props => {
    switch (props.$status) {
      case 'success':
        return 'rgba(16, 185, 129, 0.1)';
      case 'error':
        return 'rgba(239, 68, 68, 0.1)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.1)';
      default:
        return 'transparent';
    }
  }};
  border: 1px solid ${props => {
    switch (props.$status) {
      case 'success':
        return 'rgba(16, 185, 129, 0.3)';
      case 'error':
        return 'rgba(239, 68, 68, 0.3)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.3)';
      default:
        return 'transparent';
    }
  }};
`;

const StatusIcon = styled.div<{ $status: 'success' | 'error' | 'warning' }>`
  color: ${props => {
    switch (props.$status) {
      case 'success':
        return '#10B981';
      case 'error':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  }};
  margin-top: 2px;
`;

const MessageContent = styled.div`
  flex: 1;
`;

const MessageTitle = styled.div`
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;
`;

const MessageDescription = styled.div`
  font-size: 14px;
  color: #6B7280;
`;

const LineNumber = styled.span`
  color: #6B7280;
  font-family: monospace;
  margin-right: 4px;
`;

const SyntaxHighlight = styled.code`
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  padding: 2px 4px;
  font-family: monospace;
  font-size: 13px;
`;

interface ValidationIssue {
  type: 'error' | 'warning';
  lineNumber: number;
  message: string;
  content: string;
}

const SyntaxValidator: React.FC<SyntaxValidatorProps> = ({ robotsTxt }) => {
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [isValid, setIsValid] = useState<boolean>(true);
  
  useEffect(() => {
    validateRobotsTxt(robotsTxt);
  }, [robotsTxt]);
  
  const validateRobotsTxt = (content: string) => {
    const issues: ValidationIssue[] = [];
    const lines = content.split('\n');
    
    let currentUserAgent: string | null = null;
    let hasUserAgent = false;
    let hasDisallowAfterUserAgent = false;
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Skip empty lines and comments
      if (trimmedLine === '' || trimmedLine.startsWith('#')) {
        return;
      }
      
      // Check for valid directives
      if (!trimmedLine.startsWith('User-agent:') && 
          !trimmedLine.startsWith('Disallow:') && 
          !trimmedLine.startsWith('Allow:') && 
          !trimmedLine.startsWith('Sitemap:') && 
          !trimmedLine.startsWith('Crawl-delay:') && 
          !trimmedLine.startsWith('Host:')) {
        issues.push({
          type: 'error',
          lineNumber: index + 1,
          message: 'Invalid directive',
          content: trimmedLine
        });
      }
      
      // Check User-agent
      if (trimmedLine.startsWith('User-agent:')) {
        hasUserAgent = true;
        currentUserAgent = trimmedLine.substring('User-agent:'.length).trim();
        hasDisallowAfterUserAgent = false;
        
        if (!currentUserAgent) {
          issues.push({
            type: 'error',
            lineNumber: index + 1,
            message: 'User-agent directive must have a value',
            content: trimmedLine
          });
        }
      }
      
      // Check Allow/Disallow
      if (trimmedLine.startsWith('Allow:') || trimmedLine.startsWith('Disallow:')) {
        if (trimmedLine.startsWith('Disallow:')) {
          hasDisallowAfterUserAgent = true;
        }
        
        if (!hasUserAgent) {
          issues.push({
            type: 'error',
            lineNumber: index + 1,
            message: 'Allow/Disallow directive must be preceded by a User-agent directive',
            content: trimmedLine
          });
        }
        
        // Check for valid path format
        const path = trimmedLine.substring(trimmedLine.indexOf(':') + 1).trim();
        if (path && !path.startsWith('/') && !path.startsWith('*')) {
          issues.push({
            type: 'warning',
            lineNumber: index + 1,
            message: 'Path should start with a / or * character',
            content: trimmedLine
          });
        }
      }
      
      // Check Sitemap
      if (trimmedLine.startsWith('Sitemap:')) {
        const sitemapUrl = trimmedLine.substring('Sitemap:'.length).trim();
        
        if (!sitemapUrl) {
          issues.push({
            type: 'error',
            lineNumber: index + 1,
            message: 'Sitemap directive must have a URL value',
            content: trimmedLine
          });
        } else if (!sitemapUrl.startsWith('http://') && !sitemapUrl.startsWith('https://')) {
          issues.push({
            type: 'error',
            lineNumber: index + 1,
            message: 'Sitemap URL must start with http:// or https://',
            content: trimmedLine
          });
        }
      }
    });
    
    // Check if there's at least one User-agent and one Disallow
    if (!hasUserAgent) {
      issues.push({
        type: 'error',
        lineNumber: 0,
        message: 'robots.txt must contain at least one User-agent directive',
        content: 'Entire file'
      });
    }
    
    if (hasUserAgent && !hasDisallowAfterUserAgent) {
      issues.push({
        type: 'warning',
        lineNumber: 0,
        message: 'Each User-agent section should have at least one Disallow directive (empty Disallow means allow all)',
        content: 'Entire file'
      });
    }
    
    setValidationIssues(issues);
    setIsValid(issues.filter(issue => issue.type === 'error').length === 0);
  };
  
  return (
    <Container>
      {isValid && validationIssues.length === 0 && (
        <ValidationMessage $status="success">
          <StatusIcon $status="success">
            <FaCheckCircle size={20} />
          </StatusIcon>
          <MessageContent>
            <MessageTitle>Valid robots.txt syntax</MessageTitle>
            <MessageDescription>Your robots.txt file has valid syntax and follows all the standard conventions.</MessageDescription>
          </MessageContent>
        </ValidationMessage>
      )}
      
      {validationIssues.map((issue, index) => (
        <ValidationMessage 
          key={index} 
          $status={issue.type === 'error' ? 'error' : 'warning'}
        >
          <StatusIcon $status={issue.type === 'error' ? 'error' : 'warning'}>
            {issue.type === 'error' ? <FaTimesCircle size={20} /> : <FaExclamationTriangle size={20} />}
          </StatusIcon>
          <MessageContent>
            <MessageTitle>
              {issue.type === 'error' ? 'Error' : 'Warning'}: {issue.message}
            </MessageTitle>
            <MessageDescription>
              {issue.lineNumber > 0 && <LineNumber>Line {issue.lineNumber}:</LineNumber>}
              <SyntaxHighlight>{issue.content}</SyntaxHighlight>
            </MessageDescription>
          </MessageContent>
        </ValidationMessage>
      ))}
    </Container>
  );
};

export default SyntaxValidator; 