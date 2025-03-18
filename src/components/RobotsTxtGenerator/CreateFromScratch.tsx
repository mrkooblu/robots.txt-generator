'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import Button from '../common/Button';
import Tooltip from '../common/Tooltip';
import { RobotRule, Sitemap, AllowDisallow, generateRobotsTxt } from './RobotsTxtGenerator';
import { FaInfoCircle, FaClipboard, FaImages, FaUndo, FaPlus, FaLayerGroup } from 'react-icons/fa';
import CustomRuleBuilder from './CustomRuleBuilder';
import DraggableRuleList from './DraggableRuleList';
import UrlTester from './UrlTester';

interface CreateFromScratchProps {
  rules: RobotRule[];
  sitemap: Sitemap[];
  onRulesChange: (rules: RobotRule[]) => void;
  onSitemapChange: (sitemap: Sitemap[]) => void;
  onGenerate: () => void;
  onReset: () => void;
  disclaimerAgreed: boolean;
  onDisclaimerChange: (agreed: boolean) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SubTitle = styled.h2`
  font-size: ${props => props.theme.heading.h2.fontSize};
  line-height: ${props => props.theme.heading.h2.lineHeight};
  font-weight: ${props => props.theme.heading.h2.fontWeight};
  margin: 0 0 16px 0;
  color: ${props => props.theme.colors.text.primary};
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input`
  width: 100%;
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

const ActionRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
  flex-wrap: wrap;
`;

const QuickActionRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const SitemapSection = styled.div`
  margin-bottom: 24px;
`;

const SitemapLabel = styled.label`
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 8px;
`;

const DisclaimerContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 16px;
  padding: 16px;
  background-color: #F9FAFB;
  border-radius: 8px;
`;

const DisclaimerText = styled.p`
  font-size: 14px;
  color: #4B5563;
  margin: 0;
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid #E5E7EB;
  margin-bottom: 24px;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-bottom: 2px solid ${props => props.$active ? '#3B82F6' : 'transparent'};
  color: ${props => props.$active ? '#111827' : '#6B7280'};
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #111827;
  }
`;

const TabContent = styled.div`
  margin-bottom: 24px;
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

type TabType = 'builder' | 'tester';

const CreateFromScratch: React.FC<CreateFromScratchProps> = ({
  rules,
  sitemap,
  onRulesChange,
  onSitemapChange,
  onGenerate,
  onReset,
  disclaimerAgreed,
  onDisclaimerChange,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('builder');
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<string>('');
  
  // Helper functions for rules
  const addRule = (rule: RobotRule) => {
    onRulesChange([...rules, rule]);
  };

  const deleteRule = (id: string) => {
    onRulesChange(rules.filter(rule => rule.id !== id));
  };

  const updateRule = (id: string, updates: Partial<RobotRule>) => {
    onRulesChange(
      rules.map(rule => (rule.id === id ? { ...rule, ...updates } : rule))
    );
  };

  // Helper functions for sitemap
  const updateSitemap = (url: string) => {
    if (sitemap.length > 0) {
      onSitemapChange([
        {
          id: sitemap[0].id,
          url
        }
      ]);
    } else {
      onSitemapChange([
        {
          id: uuidv4(),
          url
        }
      ]);
    }
  };
  
  const handleEditRule = (id: string) => {
    setEditingRuleId(id);
    // In a real implementation, you might want to populate the CustomRuleBuilder with the rule being edited
  };

  // Quick action functions
  const copyEssentialFiles = () => {
    const essentialFilesRules: RobotRule[] = [
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/wp-admin/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent access to admin area'
      },
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/wp-includes/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent access to includes files'
      },
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/wp-content/plugins/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent access to plugin files'
      },
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/wp-json/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent access to REST API'
      }
    ];
    onRulesChange(essentialFilesRules);
  };

  const copyAllImages = () => {
    const imageRules: RobotRule[] = [
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/*.jpg$',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent indexing of JPG images'
      },
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/*.jpeg$',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent indexing of JPEG images'
      },
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/*.png$',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent indexing of PNG images'
      },
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/*.gif$',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent indexing of GIF images'
      },
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/*.webp$',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent indexing of WebP images'
      }
    ];
    onRulesChange(imageRules);
  };
  
  // Update the preview content
  React.useEffect(() => {
    // Avoid using the generateRobotsTxt import which is causing type issues
    // Just generate a simple preview directly 
    const generatePreview = (rules: RobotRule[], sitemap: Sitemap[]): string => {
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

    const preview = generatePreview(rules, sitemap);
    if (preview !== previewContent) {
      setPreviewContent(preview);
    }
  }, [rules, sitemap, previewContent]);

  return (
    <Container>
      <SubTitle>Create a robots.txt file from scratch</SubTitle>
      
      <Tabs>
        <Tab 
          $active={activeTab === 'builder'} 
          onClick={() => setActiveTab('builder')}
        >
          Rule Builder
        </Tab>
        <Tab 
          $active={activeTab === 'tester'} 
          onClick={() => setActiveTab('tester')}
        >
          URL Tester
        </Tab>
      </Tabs>
      
      {activeTab === 'builder' && (
        <TabContent>
          <CustomRuleBuilder onAddRule={addRule} />
          
          <DraggableRuleList 
            rules={rules} 
            onRulesChange={onRulesChange}
            onEditRule={handleEditRule}
            onDeleteRule={deleteRule}
          />
          
          <QuickActionRow>
            <Button 
              onClick={copyEssentialFiles} 
              variant="secondary" 
              size="sm"
              icon={<FaClipboard />}
            >
              Add essential files template
            </Button>
            <Button 
              onClick={copyAllImages} 
              variant="secondary" 
              size="sm" 
              icon={<FaImages />}
            >
              Add block images template
            </Button>
          </QuickActionRow>
          
          <SitemapSection>
            <SitemapLabel>
              Your sitemap file
              <Tooltip 
                content="Enter the URL of your XML sitemap. This helps search engines discover and crawl all the pages on your site."
                position="top"
              >
                <InfoIcon size={16} />
              </Tooltip>
            </SitemapLabel>
            <Input
              type="text"
              value={sitemap[0]?.url || ''}
              onChange={(e) => updateSitemap(e.target.value)}
              placeholder="https://your-site.com/sitemap.xml"
            />
          </SitemapSection>
        </TabContent>
      )}
      
      {activeTab === 'tester' && (
        <TabContent>
          <UrlTester rules={rules} />
        </TabContent>
      )}
      
      <DisclaimerContainer>
        <input
          type="checkbox"
          id="disclaimer"
          checked={disclaimerAgreed}
          onChange={(e) => onDisclaimerChange(e.target.checked)}
        />
        <DisclaimerText>
          I acknowledge that I'm using this robots.txt tool voluntarily. Exploding Topics takes no responsibility for any errors or non-indexing of a website.
        </DisclaimerText>
      </DisclaimerContainer>
      
      <ActionRow>
        <Button
          onClick={onGenerate}
          disabled={!disclaimerAgreed}
          variant="primary"
        >
          Generate robots.txt
        </Button>
        <Button 
          onClick={onReset} 
          variant="outline"
          icon={<FaUndo />}
        >
          Reset
        </Button>
      </ActionRow>
    </Container>
  );
};

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

export default CreateFromScratch; 