'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { theme } from '../styles/theme';

import CreateFromScratch from './RobotsTxtGenerator/CreateFromScratch';
import Suggestions from './RobotsTxtGenerator/Suggestions';
import ResultModal from './RobotsTxtGenerator/ResultModal';
import TipWidget from './common/TipWidget';
import InlineTip from './common/InlineTip';
import { useTips } from '../context/TipContext';
import SemrushTooltip from './common/SemrushTooltip';
import { getRandomTipForField } from '@/data/SemrushTooltipTips';

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
  display: flex;
  flex-direction: column;
  
  @media (min-width: ${theme.breakpoints.lg}) {
    flex-direction: row;
  }
`;

const MainContent = styled.div`
  flex: 1;
  margin-right: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.lg}) {
    margin-right: 0;
  }
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

const InlineTipWrapper = styled.div`
  margin: ${theme.spacing.md} 0;
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
  
  // Get tips context
  const { 
    currentTrigger, 
    setCurrentTrigger, 
    showInlineTip, 
    inlineTipTrigger, 
    showInlineTipWithTrigger 
  } = useTips();

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
    
    // Show inline tip about resetting
    showInlineTipWithTrigger('general');
  };

  const handleGenerateFromScratch = () => {
    const content = generateRobotsTxt(rules, sitemap);
    setGeneratedContent(content);
    setShowResult(true);
    
    // Show a tip about site audit after generating
    showInlineTipWithTrigger('general');
  };

  const handleGenerateFromSuggestion = () => {
    const content = generateRobotsTxt([], sitemap);
    setGeneratedContent(content);
    setShowResult(true);
    
    // Show a tip about suggestions
    showInlineTipWithTrigger('general');
  };
  
  // Update current trigger based on user actions
  useEffect(() => {
    // If they have disallow rules
    if (rules.some(rule => rule.permission === 'disallow')) {
      setCurrentTrigger('disallow');
    } 
    // If they have allow rules
    else if (rules.some(rule => rule.permission === 'allow')) {
      setCurrentTrigger('allow');
    }
    // If they have sitemaps
    else if (sitemap.some(site => site.url.trim() !== '')) {
      setCurrentTrigger('sitemap');
    }
    // If they have rules for specific bots
    else if (rules.some(rule => !rule.bot.includes('All'))) {
      setCurrentTrigger('bot');
    }
    else {
      setCurrentTrigger('general');
    }
  }, [rules, sitemap, setCurrentTrigger]);
  
  // Show inline tip when user adds a specific rule type
  useEffect(() => {
    if (rules.length === 0) return;
    
    // Get the most recently added rule
    const latestRule = rules[rules.length - 1];
    
    if (latestRule.permission === 'disallow') {
      showInlineTipWithTrigger('disallow');
    } else if (latestRule.permission === 'allow') {
      showInlineTipWithTrigger('allow');
    }
    
    // If WordPress related content is blocked
    if (latestRule.path.includes('wp-') || latestRule.path.includes('wordpress')) {
      showInlineTipWithTrigger('wordpress');
    }
    
    // If image files are blocked
    if (latestRule.path.includes('.jpg') || latestRule.path.includes('.png') || 
        latestRule.path.includes('.gif') || latestRule.path.includes('image')) {
      showInlineTipWithTrigger('image');
    }
  }, [rules, showInlineTipWithTrigger]);

  return (
    <Container>
      <MainContent>
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
        
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <SemrushTooltip 
            tip={getRandomTipForField('general').tip}
            semrushLink={getRandomTipForField('general').semrushLink}
            linkText={getRandomTipForField('general').linkText}
            position="right"
          />
          <small style={{ color: '#6B7280', marginLeft: '28px', fontSize: '13px' }}>
            Pro tip: Learn how to optimize your robots.txt file with our SEO tools
          </small>
        </div>
        
        {showInlineTip && (
          <InlineTipWrapper>
            <InlineTip 
              trigger={inlineTipTrigger} 
              autoDismiss={true}
            />
          </InlineTipWrapper>
        )}
        
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
      </MainContent>
      
      {/* Tip Widget */}
      <TipWidget currentContext={currentTrigger} />
    </Container>
  );
};

export default RobotsTxtGenerator; 