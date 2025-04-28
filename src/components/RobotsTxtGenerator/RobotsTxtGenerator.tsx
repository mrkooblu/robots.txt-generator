'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import CreateFromScratch from './CreateFromScratch';
import Suggestions from './Suggestions';
import Card from '../common/Card';
import Button from '../common/Button';
import ResultModal from './ResultModal';
import EducationalContent from './EducationalContent';
import { FaWrench, FaCogs, FaWordpress, FaBookOpen } from 'react-icons/fa';
import { useToast } from '../common/Toast';
import ErrorBoundary from '../common/ErrorBoundary';
import LoadingButton from '../common/LoadingButton';

// Types
export type AllowDisallow = 'allow' | 'disallow';
export type TabType = 'basic' | 'advanced' | 'cms' | 'learn';

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

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  overflow-x: auto;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  scrollbar-width: none; /* Hide scrollbar for Firefox */
  
  &::-webkit-scrollbar {
    display: none; /* Hide scrollbar for Chrome/Safari */
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-bottom: 24px;
    padding-bottom: 4px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    margin-bottom: 16px;
  }
  
  @media (max-width: 320px) {
    margin-bottom: 12px;
    padding: 0 4px;
  }
`;

const TabButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: transparent;
  border: none;
  font-weight: 600;
  font-size: 16px;
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.text.secondary};
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  min-height: 48px; /* Ensure minimum touch target size */
  
  &:hover {
    color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.text.primary};
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${props => props.$active ? props.theme.colors.primary : 'transparent'};
    transition: background-color ${props => props.theme.transition.default};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 10px 16px;
    font-size: 14px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 8px 12px;
    font-size: 13px;
    
    /* Hide text and just show icon on very small screens */
    & > span {
      display: none;
    }
    
    /* Center the icon */
    justify-content: center;
    min-width: 40px;
    
    .tab-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
  }
  
  @media (max-width: 320px) {
    min-width: 36px;
    padding: 8px;
    
    .tab-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
  }
`;

// Initial states
const initialRules: RobotRule[] = [
  {
    id: uuidv4(),
    bot: ['All'],
    path: '/',
    permission: 'allow',
    comment: 'Allow all bots to access the entire website',
  },
];

const initialSitemap: Sitemap[] = [
  {
    id: uuidv4(),
    url: 'https://example.com/sitemap.xml',
  },
];

// Generate robots.txt content based on the rules and sitemap
export const generateRobotsTxt = (rules: RobotRule[], sitemap: Sitemap[]): string => {
  let content = '';

  // Process rules
  rules.forEach(rule => {
    if (rule.bot.includes('All')) {
      content += 'User-agent: *\n';
      content += `${rule.permission === 'allow' ? 'Allow' : 'Disallow'}: ${rule.path}\n`;
      if (rule.comment) {
        content += `# ${rule.comment}\n`;
      }
      content += '\n';
    } else {
      rule.bot.forEach(bot => {
        content += `User-agent: ${bot}\n`;
        content += `${rule.permission === 'allow' ? 'Allow' : 'Disallow'}: ${rule.path}\n`;
        if (rule.comment) {
          content += `# ${rule.comment}\n`;
        }
        content += '\n';
      });
    }
  });

  // Add sitemaps
  sitemap.forEach(site => {
    if (site.url.trim()) {
      content += `Sitemap: ${site.url}\n`;
    }
  });

  return content;
};

const RobotsTxtGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [rules, setRules] = useState<RobotRule[]>(initialRules);
  const [sitemap, setSitemap] = useState<Sitemap[]>(initialSitemap);
  const [robotsTxt, setRobotsTxt] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [disclaimerAgreed, setDisclaimerAgreed] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { showToast } = useToast();
  
  const handleGenerateRobotsTxt = () => {
    try {
      setIsGenerating(true);
      // Simulate async operation
      setTimeout(() => {
        const content = generateRobotsTxt(rules, sitemap);
        setRobotsTxt(content);
        setIsModalOpen(true);
        setIsGenerating(false);
        showToast('success', 'Successfully generated robots.txt');
      }, 800);
    } catch (error) {
      setIsGenerating(false);
      showToast('error', 'Failed to generate robots.txt');
      console.error('Error generating robots.txt:', error);
    }
  };
  
  const handleReset = () => {
    setRules(initialRules);
    setSitemap(initialSitemap);
    setDisclaimerAgreed(false);
    showToast('info', 'Reset to default values');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <ErrorBoundary>
      <div>
        <TabsContainer>
          <TabButton 
            $active={activeTab === 'basic'} 
            onClick={() => setActiveTab('basic')}
          >
            <FaWrench size={16} className="tab-icon" /> <span>Basic Options</span>
          </TabButton>
          <TabButton 
            $active={activeTab === 'advanced'} 
            onClick={() => setActiveTab('advanced')}
          >
            <FaCogs size={16} className="tab-icon" /> <span>Advanced Options</span>
          </TabButton>
          <TabButton 
            $active={activeTab === 'cms'} 
            onClick={() => setActiveTab('cms')}
          >
            <FaWordpress size={16} className="tab-icon" /> <span>CMS Templates</span>
          </TabButton>
          <TabButton 
            $active={activeTab === 'learn'} 
            onClick={() => setActiveTab('learn')}
          >
            <FaBookOpen size={16} className="tab-icon" /> <span>Learn</span>
          </TabButton>
        </TabsContainer>
        
        <Card>
          {activeTab === 'basic' && (
            <Suggestions 
              onRulesChange={setRules}
              onSitemapChange={setSitemap}
              onTabChange={() => setActiveTab('advanced')}
              onGenerate={handleGenerateRobotsTxt}
              suggestionsType="general"
              isGenerating={isGenerating}
            />
          )}
          {activeTab === 'advanced' && (
            <CreateFromScratch 
              rules={rules}
              sitemap={sitemap}
              onRulesChange={setRules}
              onSitemapChange={setSitemap}
              onGenerate={handleGenerateRobotsTxt}
              onReset={handleReset}
              disclaimerAgreed={disclaimerAgreed}
              onDisclaimerChange={setDisclaimerAgreed}
              isGenerating={isGenerating}
            />
          )}
          {activeTab === 'cms' && (
            <Suggestions 
              onRulesChange={setRules}
              onSitemapChange={setSitemap}
              onTabChange={() => setActiveTab('advanced')}
              onGenerate={handleGenerateRobotsTxt}
              suggestionsType="cms"
              isGenerating={isGenerating}
            />
          )}
          {activeTab === 'learn' && (
            <EducationalContent />
          )}
        </Card>
        
        <ResultModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          content={robotsTxt}
        />
      </div>
    </ErrorBoundary>
  );
};

export default RobotsTxtGenerator; 