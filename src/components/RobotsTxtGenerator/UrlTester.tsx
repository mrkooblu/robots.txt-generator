'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { RobotRule } from './RobotsTxtGenerator';
import Button from '../common/Button';
import { FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';
import Tooltip from '../common/Tooltip';

interface UrlTesterProps {
  rules: RobotRule[];
}

const Container = styled.div`
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  background-color: #F9FAFB;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const ResultContainer = styled.div`
  margin-top: 20px;
  padding: 16px;
  border-radius: 6px;
  background-color: white;
  border: 1px solid #E5E7EB;
`;

const ResultTitle = styled.div`
  font-weight: 600;
  margin-bottom: 8px;
`;

const ResultItem = styled.div<{ $status: 'allowed' | 'disallowed' | 'pending' }>`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 8px;
  gap: 12px;
  background-color: ${props => {
    switch (props.$status) {
      case 'allowed':
        return 'rgba(16, 185, 129, 0.1)';
      case 'disallowed':
        return 'rgba(239, 68, 68, 0.1)';
      default:
        return 'white';
    }
  }};
  border: 1px solid ${props => {
    switch (props.$status) {
      case 'allowed':
        return 'rgba(16, 185, 129, 0.2)';
      case 'disallowed':
        return 'rgba(239, 68, 68, 0.2)';
      default:
        return '#E5E7EB';
    }
  }};
`;

const StatusIcon = styled.div<{ $status: 'allowed' | 'disallowed' | 'pending' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${props => {
    switch (props.$status) {
      case 'allowed':
        return '#10B981';
      case 'disallowed':
        return '#EF4444';
      default:
        return '#E5E7EB';
    }
  }};
  color: white;
`;

const ResultDetails = styled.div`
  flex: 1;
`;

const BotName = styled.div`
  font-weight: 500;
  color: #111827;
`;

const RuleDetails = styled.div`
  font-size: 13px;
  color: #6B7280;
`;

const NoResultMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #6B7280;
  font-style: italic;
`;

const InfoIcon = styled(FaInfoCircle)`
  color: #718096;
  margin-left: 6px;
  cursor: help;
  line-height: 1;
  vertical-align: middle;
  transition: color 0.2s;
  
  &:hover {
    color: #4A5568;
  }
`;

const Explanation = styled.p`
  font-size: 13px;
  color: #6B7280;
  margin: 8px 0 0;
  padding: 8px;
  background-color: #F3F4F6;
  border-radius: 4px;
  border-left: 3px solid #9CA3AF;
`;

// Bot options as specified in the requirements
const botOptions = [
  "All",
  "Bingbot",
  "Googlebot",
  "Googlebot-Image",
  "Googlebot-Mobile",
  "Googlebot-News",
  "Googlebot-Video",
  "Mediapartners-Google",
  "AdsBot-Google",
  "YandexBot",
  "AhrefsBot",
  "SemrushBot"
];

// Helper function to check if a URL path matches a rule pattern
const pathMatchesPattern = (urlPath: string, rulePattern: string): boolean => {
  // Convert rule pattern to regex
  let pattern = rulePattern.replace(/\*/g, '.*');
  if (pattern.endsWith('$')) {
    // Handle the $ at the end which means exact match in robots.txt
    pattern = `^${pattern}`;
  } else if (!pattern.endsWith('/')) {
    // If it doesn't end with / or $, make it match the path exactly or as a prefix
    pattern = `^${pattern}(?:$|/)`;
  } else {
    // If it ends with /, it should match that directory and all subdirectories
    pattern = `^${pattern}`;
  }
  
  const regex = new RegExp(pattern);
  return regex.test(urlPath);
};

interface TestResult {
  bot: string;
  status: 'allowed' | 'disallowed';
  rule: RobotRule;
}

const UrlTester: React.FC<UrlTesterProps> = ({ rules }) => {
  const [url, setUrl] = useState<string>('');
  const [selectedBot, setSelectedBot] = useState<string>('All');
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  
  const testUrl = () => {
    if (!url) {
      alert('Please enter a URL to test');
      return;
    }
    
    try {
      // Parse the URL
      const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
      const path = parsedUrl.pathname;
      
      // Filter rules based on selected bot
      let relevantRules = rules.filter(rule => 
        rule.bot.includes('All') || rule.bot.includes(selectedBot)
      );
      
      // Sort rules by specificity (more specific paths first)
      relevantRules = relevantRules.sort((a, b) => {
        // More specific rules (longer paths) should come first
        return b.path.length - a.path.length;
      });
      
      const results: TestResult[] = [];
      
      // Find the first matching rule for each bot that applies
      const botsToCheck = selectedBot === 'All' 
        ? ['All', ...botOptions.filter(b => b !== 'All')]
        : [selectedBot];
        
      botsToCheck.forEach(bot => {
        // Find rules that apply to this bot
        const botRules = relevantRules.filter(rule => 
          rule.bot.includes('All') || rule.bot.includes(bot)
        );
        
        // Find the first rule that matches the path
        for (const rule of botRules) {
          if (pathMatchesPattern(path, rule.path)) {
            results.push({
              bot,
              status: rule.permission === 'allow' ? 'allowed' : 'disallowed',
              rule
            });
            break;
          }
        }
        
        // If no rule matched, it's allowed by default
        if (!results.find(r => r.bot === bot) && bot !== 'All') {
          results.push({
            bot,
            status: 'allowed',
            rule: {
              id: 'default',
              bot: [bot],
              path: '/',
              permission: 'allow',
              comment: 'Default rule: If no rule matches, crawling is allowed'
            }
          });
        }
      });
      
      // Remove duplicate All bot results if a specific bot has its own result
      const filteredResults = results.filter(result => {
        if (result.bot === 'All') {
          return !results.some(r => r.bot !== 'All' && r.rule.id === result.rule.id);
        }
        return true;
      });
      
      setTestResults(filteredResults);
      
    } catch (error) {
      alert('Please enter a valid URL');
    }
  };
  
  return (
    <Container>
      <Title>
        <FaCheck size={14} />
        URL Tester
      </Title>
      
      <FormGroup>
        <Label>
          Test URL
          <Tooltip 
            content="Enter a URL to check if it would be allowed or disallowed based on your robots.txt rules."
            position="top"
          >
            <InfoIcon size={16} />
          </Tooltip>
        </Label>
        <InputGroup>
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/page"
          />
          <Select
            value={selectedBot}
            onChange={(e) => setSelectedBot(e.target.value)}
          >
            {botOptions.map(bot => (
              <option key={bot} value={bot}>{bot}</option>
            ))}
          </Select>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={testUrl}
          >
            Test
          </Button>
        </InputGroup>
      </FormGroup>
      
      {testResults && (
        <ResultContainer>
          <ResultTitle>Test Results</ResultTitle>
          
          {testResults.length === 0 ? (
            <NoResultMessage>No matching rules found. The URL is allowed by default.</NoResultMessage>
          ) : (
            <>
              {testResults.map((result, index) => (
                <ResultItem key={index} $status={result.status}>
                  <StatusIcon $status={result.status}>
                    {result.status === 'allowed' ? <FaCheck size={12} /> : <FaTimes size={12} />}
                  </StatusIcon>
                  <ResultDetails>
                    <BotName>{result.bot}</BotName>
                    <RuleDetails>
                      Rule: {result.rule.permission === 'allow' ? 'Allow' : 'Disallow'} {result.rule.path}
                      {result.rule.comment && ` • ${result.rule.comment}`}
                    </RuleDetails>
                  </ResultDetails>
                </ResultItem>
              ))}
              
              <Explanation>
                {testResults.some(r => r.status === 'disallowed') 
                  ? 'This URL would be blocked for some or all bots based on your current rules.'
                  : 'This URL would be allowed for all selected bots based on your current rules.'}
              </Explanation>
            </>
          )}
        </ResultContainer>
      )}
    </Container>
  );
};

export default UrlTester; 