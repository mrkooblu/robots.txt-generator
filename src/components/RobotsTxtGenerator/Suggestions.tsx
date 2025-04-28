'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import Button from '../common/Button';
import LoadingButton from '../common/LoadingButton';
import Tooltip from '../common/Tooltip';
import InfoIcon from '../common/InfoIcon';
import { RobotRule, Sitemap, AllowDisallow, generateRobotsTxt } from './RobotsTxtGenerator';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface SuggestionsProps {
  onRulesChange: (rules: RobotRule[]) => void;
  onSitemapChange: (sitemap: Sitemap[]) => void;
  onTabChange: () => void;
  onGenerate: () => void;
  suggestionsType?: 'general' | 'cms';
  isGenerating?: boolean;
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

const SuggestionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  margin-bottom: 24px;
`;

const SuggestionColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CategoryTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
`;

const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 12px;
  box-shadow: ${props => props.theme.shadows?.card || '0 1px 3px rgba(0, 0, 0, 0.1)'};
  transition: all 0.2s ease-in-out;
  
  &:hover {
    box-shadow: ${props => props.theme.shadows?.hover || '0 4px 6px rgba(0, 0, 0, 0.1)'};
  }
`;

const OptionHeader = styled.div<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: ${props => props.$selected ? '#F3F4F6' : 'white'};
  border-bottom: ${props => props.$selected ? '1px solid #E5E7EB' : 'none'};
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #F9FAFB;
  }
`;

const RadioInput = styled.input`
  margin: 0;
`;

const OptionLabel = styled.label`
  font-size: 15px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  flex: 1;
  display: flex;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 14px;
    line-height: 1.3;
  }
`;

const CodePreview = styled.pre`
  margin: 0;
  padding: 12px;
  background-color: #F9FAFB;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
  color: #334155;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
  border-top: 1px solid #E5E7EB;
`;

const AllowLine = styled.span`
  display: block;
  background-color: rgba(16, 185, 129, 0.1);
  padding: 2px 8px;
  margin: 2px -8px;
  border-radius: 4px;
`;

const DisallowLine = styled.span`
  display: block;
  background-color: rgba(239, 68, 68, 0.1);
  padding: 2px 8px;
  margin: 2px -8px;
  border-radius: 4px;
`;

const PreviewToggle = styled.button`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  color: #6B7280;
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: #3B82F6;
  }
`;

const SitemapSection = styled.div`
  margin-bottom: 24px;
`;

const DisclaimerSection = styled.div`
  margin-bottom: 16px;
  padding: 12px;
  background-color: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
`;

const DisclaimerCheckbox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const CheckboxInput = styled.input`
  margin-top: 2px;
`;

const DisclaimerText = styled.label`
  font-size: 14px;
  line-height: 1.5;
  color: #4B5563;
`;

const SitemapLabel = styled.label`
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 8px;
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

// Format the preview content with colored lines
const formatPreviewWithHighlighting = (content: string) => {
  const lines = content.split('\n');
  const formattedContent = lines.map((line, index) => {
    if (line.startsWith('Allow:')) {
      return <AllowLine key={index}>{line}</AllowLine>;
    } else if (line.startsWith('Disallow:')) {
      return <DisallowLine key={index}>{line}</DisallowLine>;
    }
    return <span key={index}>{line}</span>;
  });
  
  return <>{formattedContent}</>;
};

// Generate preview text for each suggestion
const generatePreviewText = (rules: RobotRule[]): string => {
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
    });
    
    content += '\n';
  });
  
  return content;
};

// General suggestions with descriptions and generated rules
const generalSuggestions = [
  {
    id: 'allow-everything',
    name: 'Allow everything',
    description: 'This option allows all bots to crawl your entire website without restrictions.',
    rules: [
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/',
        permission: 'allow' as AllowDisallow,
        comment: 'Allow all bots to crawl the entire website',
      },
    ],
    sitemap: [{ id: uuidv4(), url: '' }],
    preview: `User-agent: *
Allow: /
`,
  },
  {
    id: 'disallow-website-crawl',
    name: 'Disallow a website to crawl',
    description: 'This option prevents all bots from crawling any part of your website.',
    rules: [
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent all bots from crawling the website',
      },
    ],
    sitemap: [{ id: uuidv4(), url: '' }],
    preview: `User-agent: *
Disallow: /
`,
  },
  {
    id: 'allow-google-only',
    name: 'Allow everything for Google only',
    description: 'This option allows only Google bots to crawl your website while blocking all other bots.',
    rules: [
      {
        id: uuidv4(),
        bot: ['Googlebot'],
        path: '/',
        permission: 'allow' as AllowDisallow,
        comment: 'Allow Googlebot to crawl the entire website',
      },
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent all other bots from crawling the website',
      },
    ],
    sitemap: [{ id: uuidv4(), url: '' }],
    preview: `User-agent: Googlebot
Allow: /

User-agent: *
Disallow: /
`,
  },
  {
    id: 'allow-major-search-engines',
    name: 'Allow major international search engines only',
    description: 'This option allows only major international search engines to crawl your website while blocking all other bots.',
    rules: [
      {
        id: uuidv4(),
        bot: ['Googlebot'],
        path: '/',
        permission: 'allow' as AllowDisallow,
        comment: 'Allow Google to crawl the entire website',
      },
      {
        id: uuidv4(),
        bot: ['Bingbot'],
        path: '/',
        permission: 'allow' as AllowDisallow,
        comment: 'Allow Bing to crawl the entire website',
      },
      {
        id: uuidv4(),
        bot: ['Slurp'],
        path: '/',
        permission: 'allow' as AllowDisallow,
        comment: 'Allow Yahoo to crawl the entire website',
      },
      {
        id: uuidv4(),
        bot: ['Baiduspider'],
        path: '/',
        permission: 'allow' as AllowDisallow,
        comment: 'Allow Baidu to crawl the entire website',
      },
      {
        id: uuidv4(),
        bot: ['Yeti'],
        path: '/',
        permission: 'allow' as AllowDisallow,
        comment: 'Allow Naver to crawl the entire website',
      },
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent all other bots from crawling the website',
      },
    ],
    sitemap: [{ id: uuidv4(), url: '' }],
    preview: `User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: Yeti
Allow: /

User-agent: *
Disallow: /
`,
  },
  {
    id: 'allow-search-block-ai',
    name: 'Allow search engines, block AI crawlers',
    description: 'This option allows traditional search engines to crawl your site while specifically blocking AI language model crawlers.',
    rules: [
      {
        id: uuidv4(),
        bot: ['Googlebot'],
        path: '/',
        permission: 'allow' as AllowDisallow,
        comment: 'Allow Google to crawl the entire website',
      },
      {
        id: uuidv4(),
        bot: ['Bingbot'],
        path: '/',
        permission: 'allow' as AllowDisallow,
        comment: 'Allow Bing to crawl the entire website',
      },
      {
        id: uuidv4(),
        bot: ['Slurp'],
        path: '/',
        permission: 'allow' as AllowDisallow,
        comment: 'Allow Yahoo to crawl the entire website',
      },
      {
        id: uuidv4(),
        bot: ['GPTBot'],
        path: '/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent OpenAI\'s GPTBot from crawling the website',
      },
      {
        id: uuidv4(),
        bot: ['Claude-Web'],
        path: '/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent Anthropic\'s Claude-Web from crawling the website',
      },
      {
        id: uuidv4(),
        bot: ['Google-Extended'],
        path: '/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent Google\'s AI crawler from crawling the website',
      },
      {
        id: uuidv4(),
        bot: ['CCBot'],
        path: '/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent Common Crawl bot from crawling the website',
      },
    ],
    sitemap: [{ id: uuidv4(), url: '' }],
    preview: `User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: GPTBot
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /
`,
  },
  {
    id: 'disallow-common-bots',
    name: 'Disallow everything for most commonly blocked bots',
    description: 'This option blocks commonly unwanted bots like MJ12bot, AhrefsBot, and SemrushBot from crawling your website.',
    rules: [
      {
        id: uuidv4(),
        bot: ['MJ12bot'],
        path: '/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent MJ12bot from crawling the website',
      },
      {
        id: uuidv4(),
        bot: ['AhrefsBot'],
        path: '/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent AhrefsBot from crawling the website',
      },
      {
        id: uuidv4(),
        bot: ['SemrushBot'],
        path: '/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent SemrushBot from crawling the website',
      },
    ],
    sitemap: [{ id: uuidv4(), url: '' }],
    preview: `User-agent: MJ12bot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /
`,
  },
  {
    id: 'block-ai-llm-crawlers',
    name: 'Block all AI/LLM crawlers',
    description: 'This option blocks AI language model crawlers (like GPTBot, Claude-Web, etc.) from accessing your content while allowing traditional search engines.',
    rules: [
      {
        id: uuidv4(),
        bot: ['GPTBot'],
        path: '/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent OpenAI\'s GPTBot from crawling the website',
      },
      {
        id: uuidv4(),
        bot: ['Claude-Web'],
        path: '/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent Anthropic\'s Claude-Web from crawling the website',
      },
      {
        id: uuidv4(),
        bot: ['Google-Extended'],
        path: '/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent Google\'s AI crawler from crawling the website',
      },
      {
        id: uuidv4(),
        bot: ['CCBot'],
        path: '/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent Common Crawl bot from crawling the website',
      },
      {
        id: uuidv4(),
        bot: ['Cohere-crawler'],
        path: '/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent Cohere\'s crawler from crawling the website',
      },
      {
        id: uuidv4(),
        bot: ['anthropic-ai'],
        path: '/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent alternative Anthropic crawler from crawling the website',
      },
    ],
    sitemap: [{ id: uuidv4(), url: '' }],
    preview: `User-agent: GPTBot
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Cohere-crawler
Disallow: /

User-agent: anthropic-ai
Disallow: /
`,
  },
  {
    id: 'disallow-google-except-main',
    name: 'Disallow for all Google bots, except Google',
    description: 'This option blocks all Google-specific bots (e.g., Googlebot-Image, Googlebot-News) except the main Googlebot.',
    rules: [
      {
        id: uuidv4(),
        bot: ['Googlebot-Image'],
        path: '/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent Googlebot-Image from crawling the website',
      },
      {
        id: uuidv4(),
        bot: ['Googlebot-Mobile'],
        path: '/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent Googlebot-Mobile from crawling the website',
      },
      {
        id: uuidv4(),
        bot: ['Googlebot-News'],
        path: '/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent Googlebot-News from crawling the website',
      },
      {
        id: uuidv4(),
        bot: ['Googlebot-Video'],
        path: '/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent Googlebot-Video from crawling the website',
      },
    ],
    sitemap: [{ id: uuidv4(), url: '' }],
    preview: `User-agent: Googlebot-Image
Disallow: /

User-agent: Googlebot-Mobile
Disallow: /

User-agent: Googlebot-News
Disallow: /

User-agent: Googlebot-Video
Disallow: /
`,
  },
  {
    id: 'allow-all-google-bots',
    name: 'Allow for all Google bots',
    description: 'This option allows all Google bots (including Googlebot, Googlebot-Image, etc.) to crawl your website.',
    rules: [
      {
        id: uuidv4(),
        bot: ['Googlebot'],
        path: '/',
        permission: 'allow' as AllowDisallow,
        comment: 'Allow Googlebot to crawl the entire website',
      },
      {
        id: uuidv4(),
        bot: ['Googlebot-Image'],
        path: '/',
        permission: 'allow' as AllowDisallow,
        comment: 'Allow Googlebot-Image to crawl the entire website',
      },
      {
        id: uuidv4(),
        bot: ['Googlebot-Mobile'],
        path: '/',
        permission: 'allow' as AllowDisallow,
        comment: 'Allow Googlebot-Mobile to crawl the entire website',
      },
      {
        id: uuidv4(),
        bot: ['Googlebot-News'],
        path: '/',
        permission: 'allow' as AllowDisallow,
        comment: 'Allow Googlebot-News to crawl the entire website',
      },
      {
        id: uuidv4(),
        bot: ['Googlebot-Video'],
        path: '/',
        permission: 'allow' as AllowDisallow,
        comment: 'Allow Googlebot-Video to crawl the entire website',
      },
    ],
    sitemap: [{ id: uuidv4(), url: '' }],
    preview: `User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

User-agent: Googlebot-Mobile
Allow: /

User-agent: Googlebot-News
Allow: /

User-agent: Googlebot-Video
Allow: /
`,
  },
];

// CMS-specific suggestions with descriptions and generated rules
const cmsSuggestions = [
  {
    id: 'wordpress',
    name: 'robots.txt for WordPress',
    description: 'This robots.txt is optimized for WordPress, blocking access to sensitive areas like /wp-admin/ while allowing admin-ajax.php for functionality.',
    rules: [
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/wp-admin/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent bots from accessing WordPress admin',
      },
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/wp-admin/admin-ajax.php',
        permission: 'allow' as AllowDisallow,
        comment: 'Allow AJAX functionality',
      },
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/wp-includes/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent bots from accessing WordPress includes',
      },
    ],
    sitemap: [{ id: uuidv4(), url: '' }],
    preview: `User-agent: *
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php
Disallow: /wp-includes/
`,
  },
  {
    id: 'joomla',
    name: 'robots.txt for Joomla',
    description: 'This robots.txt is tailored for Joomla, restricting access to the administrator and temporary folders.',
    rules: [
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/administrator/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent bots from accessing Joomla admin',
      },
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/cache/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent bots from accessing cache',
      },
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/tmp/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent bots from accessing temporary files',
      },
    ],
    sitemap: [{ id: uuidv4(), url: '' }],
    preview: `User-agent: *
Disallow: /administrator/
Disallow: /cache/
Disallow: /tmp/
`,
  },
  {
    id: 'modx',
    name: 'robots.txt for MODX',
    description: 'This robots.txt is designed for MODX, blocking access to the manager and assets directories.',
    rules: [
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/manager/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent bots from accessing MODX manager',
      },
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/assets/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent bots from accessing assets',
      },
    ],
    sitemap: [{ id: uuidv4(), url: '' }],
    preview: `User-agent: *
Disallow: /manager/
Disallow: /assets/
`,
  },
  {
    id: 'drupal',
    name: 'robots.txt for Drupal',
    description: 'This robots.txt is optimized for Drupal, preventing bots from accessing admin and file directories.',
    rules: [
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/admin/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent bots from accessing Drupal admin',
      },
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/sites/default/files/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent bots from accessing uploaded files',
      },
    ],
    sitemap: [{ id: uuidv4(), url: '' }],
    preview: `User-agent: *
Disallow: /admin/
Disallow: /sites/default/files/
`,
  },
  {
    id: 'magento',
    name: 'robots.txt for Magento',
    description: 'This robots.txt is crafted for Magento, blocking access to admin, downloader, and var directories.',
    rules: [
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/admin/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent bots from accessing Magento admin',
      },
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/downloader/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent bots from accessing downloader',
      },
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/var/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent bots from accessing var directory',
      },
    ],
    sitemap: [{ id: uuidv4(), url: '' }],
    preview: `User-agent: *
Disallow: /admin/
Disallow: /downloader/
Disallow: /var/
`,
  },
  {
    id: 'opencart',
    name: 'robots.txt for OpenCart',
    description: 'This robots.txt is suited for OpenCart, restricting access to admin and system directories.',
    rules: [
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/admin/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent bots from accessing OpenCart admin',
      },
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/system/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent bots from accessing system directory',
      },
    ],
    sitemap: [{ id: uuidv4(), url: '' }],
    preview: `User-agent: *
Disallow: /admin/
Disallow: /system/
`,
  },
  {
    id: 'woocommerce',
    name: 'robots.txt for WooCommerce',
    description: 'This robots.txt is optimized for WooCommerce, blocking access to admin, cart, and checkout pages.',
    rules: [
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/wp-admin/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent bots from accessing WordPress admin',
      },
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/cart/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent bots from accessing cart',
      },
      {
        id: uuidv4(),
        bot: ['All'],
        path: '/checkout/',
        permission: 'disallow' as AllowDisallow,
        comment: 'Prevent bots from accessing checkout',
      },
    ],
    sitemap: [{ id: uuidv4(), url: '' }],
    preview: `User-agent: *
Disallow: /wp-admin/
Disallow: /cart/
Disallow: /checkout/
`,
  },
];

const Suggestions: React.FC<SuggestionsProps> = ({
  onRulesChange,
  onSitemapChange,
  onTabChange,
  onGenerate,
  suggestionsType = 'general',
  isGenerating = false,
}) => {
  const [selectedId, setSelectedId] = useState<string>('');
  const [sitemapUrl, setSitemapUrl] = useState<string>('');
  const [expandedOptions, setExpandedOptions] = useState<{ [key: string]: boolean }>({});
  const [disclaimerChecked, setDisclaimerChecked] = useState<boolean>(false);

  const handleOptionSelect = (id: string) => {
    setSelectedId(id);
    
    // Find the selected suggestion
    const suggestionList = suggestionsType === 'general' ? generalSuggestions : cmsSuggestions;
    const selectedOption = suggestionList.find(option => option.id === id);
    
    if (selectedOption) {
      onRulesChange(selectedOption.rules);
      
      // Preserve the current sitemap URL
      if (sitemapUrl) {
        onSitemapChange([{ id: uuidv4(), url: sitemapUrl }]);
      } else {
        onSitemapChange(selectedOption.sitemap);
      }
      
      // Auto-expand the selected option if it's not expanded
      if (!expandedOptions[id]) {
        toggleOptionExpansion(id);
      }
    }
  };

  const toggleOptionExpansion = (id: string) => {
    setExpandedOptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSitemapChange = (url: string) => {
    setSitemapUrl(url);
    onSitemapChange([{ id: uuidv4(), url }]);
  };

  const handleReset = () => {
    setSelectedId('');
    setSitemapUrl('');
    onRulesChange([]);
    onSitemapChange([{ id: uuidv4(), url: '' }]);
    setExpandedOptions({});
  };

  // Choose the right suggestion list based on the type
  const suggestionList = suggestionsType === 'general' ? generalSuggestions : cmsSuggestions;
  const title = suggestionsType === 'general' ? 'Basic Options' : 'CMS Templates';

  return (
    <Container>
      <SubTitle>{title}</SubTitle>
      
      <SuggestionColumn>
        {suggestionList.map((suggestion) => (
          <OptionContainer key={suggestion.id}>
            <OptionHeader 
              $selected={selectedId === suggestion.id}
              onClick={() => handleOptionSelect(suggestion.id)}
            >
              <RadioInput
                type="radio"
                id={suggestion.id}
                name="suggestion"
                checked={selectedId === suggestion.id}
                onChange={() => handleOptionSelect(suggestion.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <OptionLabel htmlFor={suggestion.id} onClick={(e) => e.stopPropagation()}>
                {suggestion.name}
                <Tooltip 
                  content={suggestion.description}
                  position="top"
                  maxWidth="300px"
                >
                  <span onClick={(e) => e.stopPropagation()}>
                    <InfoIcon size={18} />
                  </span>
                </Tooltip>
              </OptionLabel>
              <PreviewToggle 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOptionExpansion(suggestion.id);
                }}
              >
                {expandedOptions[suggestion.id] ? <FaChevronUp /> : <FaChevronDown />}
              </PreviewToggle>
            </OptionHeader>
            
            {expandedOptions[suggestion.id] && (
              <CodePreview>
                {formatPreviewWithHighlighting(suggestion.preview)}
              </CodePreview>
            )}
          </OptionContainer>
        ))}
      </SuggestionColumn>
      
      <SitemapSection>
        <SitemapLabel>Your sitemap file</SitemapLabel>
        <Input
          type="text"
          value={sitemapUrl}
          onChange={(e) => handleSitemapChange(e.target.value)}
          placeholder="https://your-site.com/sitemap.xml"
        />
      </SitemapSection>
      
      <DisclaimerSection>
        <DisclaimerCheckbox>
          <CheckboxInput 
            type="checkbox" 
            id="disclaimer-checkbox"
            checked={disclaimerChecked}
            onChange={(e) => setDisclaimerChecked(e.target.checked)}
          />
          <DisclaimerText htmlFor="disclaimer-checkbox">
            I acknowledge that I'm using this robots.txt tool voluntarily. Exploding Topics takes no responsibility for any errors or non-indexing of a website.
          </DisclaimerText>
        </DisclaimerCheckbox>
      </DisclaimerSection>
      
      <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
        <LoadingButton
          onClick={onGenerate}
          isLoading={isGenerating}
          loadingText="Generating..."
          disabled={!selectedId}
        >
          Generate robots.txt
        </LoadingButton>
        <Button variant="outline" onClick={onTabChange}>
          Advanced Options
        </Button>
      </div>
    </Container>
  );
};

export default Suggestions; 