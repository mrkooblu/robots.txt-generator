'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { theme } from '../styles/theme';

import CreateFromScratch from './RobotsTxtGenerator/CreateFromScratch';
import Suggestions from './RobotsTxtGenerator/Suggestions';
import ResultModal from './RobotsTxtGenerator/ResultModal';

// Define the types here to avoid import issues
export type AllowDisallow = 'allow' | 'disallow';

export interface RobotRule {
  id: string;
  bot: string[];
  path: string;
  permission: AllowDisallow;
  comment?: string;
}

export interface Sitemap {
  id: string;
  url: string;
}

export const generateRobotsTxt = (rules: RobotRule[], sitemap: Sitemap[]): string => {
  let content = '';
  
  // Group rules by bot
  const botGroups: { [key: string]: RobotRule[] } = {};
  
  rules.forEach(rule => {
    if (rule.bot.includes('All')) {
      if (!botGroups['*']) botGroups['*'] = [];
      botGroups['*'].push(rule);
    } else {
      rule.bot.forEach(bot => {
        if (!botGroups[bot]) botGroups[bot] = [];
        botGroups[bot].push(rule);
      });
    }
  });
  
  // Generate content for each bot group
  Object.entries(botGroups).forEach(([bot, botRules]) => {
    content += `User-agent: ${bot}\n`;
    
    botRules.forEach(rule => {
      content += `${rule.permission === 'allow' ? 'Allow' : 'Disallow'}: ${rule.path}\n`;
      if (rule.comment) {
        content += `# ${rule.comment}\n`;
      }
    });
    
    content += '\n';
  });
  
  // Add sitemaps
  sitemap.forEach(site => {
    if (site.url.trim()) {
      content += `Sitemap: ${site.url}\n`;
    }
  });
  
  return content;
};

const Container = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.colors.border};
  margin-bottom: ${theme.spacing.xl};
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border: none;
  background: transparent;
  font-weight: ${props => props.$active ? theme.fonts.weights.semibold : theme.fonts.weights.medium};
  color: ${props => props.$active ? theme.colors.primary : theme.colors.text.secondary};
  position: relative;
  cursor: pointer;
  transition: ${theme.transition.default};
  
  &:after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${props => props.$active ? theme.colors.primary : 'transparent'};
    transition: ${theme.transition.default};
  }
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

const RobotsTxtGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scratch' | 'suggestions'>('scratch');
  const [rules, setRules] = useState<RobotRule[]>([
    {
      id: uuidv4(),
      permission: 'disallow' as AllowDisallow,
      path: '/wp-admin/',
      bot: ['All'],
    }
  ]);
  const [sitemap, setSitemap] = useState<Sitemap[]>([{ id: uuidv4(), url: '' }]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [disclaimerAgreed, setDisclaimerAgreed] = useState<boolean>(false);

  const handleReset = () => {
    setRules([
      {
        id: uuidv4(),
        permission: 'disallow' as AllowDisallow,
        path: '/wp-admin/',
        bot: ['All'],
      }
    ]);
    setSitemap([{ id: uuidv4(), url: '' }]);
    setSelectedSuggestion(null);
    setDisclaimerAgreed(false);
  };

  const handleGenerateFromScratch = () => {
    const content = generateRobotsTxt(rules, sitemap);
    setGeneratedContent(content);
    setShowResult(true);
  };

  const handleGenerateFromSuggestion = () => {
    const content = generateRobotsTxt([], sitemap);
    setGeneratedContent(content);
    setShowResult(true);
  };

  return (
    <Container>
      <TabsContainer>
        <Tab 
          $active={activeTab === 'scratch'} 
          onClick={() => setActiveTab('scratch')}
        >
          Create a robots.txt file from scratch
        </Tab>
        <Tab 
          $active={activeTab === 'suggestions'} 
          onClick={() => setActiveTab('suggestions')}
        >
          Choose one of the suggested options
        </Tab>
      </TabsContainer>
      
      {activeTab === 'scratch' ? (
        <CreateFromScratch 
          rules={rules}
          sitemap={sitemap}
          onRulesChange={setRules}
          onSitemapChange={setSitemap}
          onGenerate={handleGenerateFromScratch}
          onReset={handleReset}
          disclaimerAgreed={disclaimerAgreed}
          onDisclaimerChange={setDisclaimerAgreed}
        />
      ) : (
        <Suggestions 
          onRulesChange={setRules}
          onSitemapChange={setSitemap}
          onTabChange={() => setActiveTab('scratch')}
          onGenerate={handleGenerateFromSuggestion}
        />
      )}
      
      {showResult && (
        <ResultModal 
          isOpen={showResult}
          robotsTxt={generatedContent} 
          onClose={() => setShowResult(false)}
        />
      )}
    </Container>
  );
};

export default RobotsTxtGenerator; 