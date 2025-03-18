'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import Button from '../common/Button';
import Tooltip from '../common/Tooltip';
import { RobotRule, AllowDisallow } from './RobotsTxtGenerator';
import { FaInfoCircle, FaPlus, FaMinus, FaLightbulb } from 'react-icons/fa';
import GlossaryTermTooltip from './GlossaryTerms';

interface CustomRuleBuilderProps {
  onAddRule: (rule: RobotRule) => void;
}

const Container = styled.div`
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  background-color: #F9FAFB;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
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

const Description = styled.div`
  font-size: 13px;
  color: #6B7280;
  margin: 0 0 16px 0;
  line-height: 1.5;
`;

const Callout = styled.div`
  background-color: #EFF6FF;
  border-left: 4px solid #3B82F6;
  padding: 12px 16px;
  margin: 12px 0;
  border-radius: 4px;
  font-size: 13px;
  color: #1F2937;
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const CalloutIcon = styled.div`
  color: #3B82F6;
  margin-top: 2px;
`;

const CalloutContent = styled.div`
  flex: 1;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;

  @media (max-width: 480px) {
    margin-bottom: 20px; /* More space between fields on mobile */
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
  
  @media (max-width: 480px) {
    font-size: 15px; /* Slightly larger for touch */
    margin-bottom: 8px;
  }
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
  
  @media (max-width: 480px) {
    padding: 10px 12px; /* Taller input on mobile for easier touch */
    font-size: 16px; /* Prevent auto-zoom on iOS */
  }
`;

const Select = styled.select`
  width: 100%;
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
  
  @media (max-width: 480px) {
    padding: 10px 12px; /* Taller select on mobile for easier touch */
    font-size: 16px; /* Prevent auto-zoom on iOS */
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
  
  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 16px; /* Prevent auto-zoom on iOS */
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  
  @media (max-width: 480px) {
    justify-content: stretch;
    
    & > button {
      flex: 1; /* Make buttons take full width on mobile */
    }
  }
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
  
  @media (max-width: 480px) {
    font-size: 18px; /* Larger tooltip icon for touch */
    margin-left: 8px;
  }
`;

const FlexRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
`;

const BotSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  
  @media (max-width: 480px) {
    gap: 10px; /* More space between tags on mobile */
  }
`;

const BotTag = styled.div<{ $selected: boolean }>`
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: ${props => props.$selected ? '#3B82F6' : '#E5E7EB'};
  color: ${props => props.$selected ? 'white' : '#374151'};
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.$selected ? '#2563EB' : '#D1D5DB'};
  }
  
  @media (max-width: 480px) {
    padding: 8px 12px; /* Larger target area for touch */
    font-size: 14px;
  }
`;

// Bot options as specified in the requirements
const botOptions = [
  // General
  "All",
  
  // Google Bots
  "Googlebot",
  "Googlebot-Image",
  "Googlebot-Mobile",
  "Googlebot-News",
  "Googlebot-Video",
  "Mediapartners-Google",
  "AdsBot-Google",
  "Google-Extended", // Google's AI crawler for Bard/Gemini
  
  // Microsoft/Bing
  "Bingbot",
  "MSNBot",
  
  // Yahoo Bots
  "Slurp", // Yahoo's main crawler
  "Yahoo-MMCrawler", // Yahoo MM
  "Yahoo-Blogs", // Yahoo Blogs
  
  // Major International Bots
  "Baiduspider", // Baidu (China)
  "Yeti", // Naver (Korea)
  "YandexBot", // Yandex (Russia)
  
  // AI/LLM Crawlers
  "GPTBot", // OpenAI
  "Claude-Web", // Anthropic
  "Cohere-crawler", // Cohere
  "CCBot", // Common Crawl (used by many AI models)
  "anthropic-ai", // Anthropic alternative crawler
  
  // SEO & Specialty Bots
  "Teoma", // Ask.com
  "AhrefsBot",
  "SemrushBot",
  "GigaBot", // GigaBlast
  "Nutch", 
  "ia_archiver", // Alexa/Wayback
  "MJ12bot", // Majestic
  "DotBot", // DMOZ/Open Directory Project
];

// Path pattern presets
const pathPatterns = [
  { label: "Custom path", value: "" },
  { label: "All pages", value: "/" },
  { label: "Admin area", value: "/admin/" },
  { label: "Login page", value: "/login/" },
  { label: "Images (jpg, png, gif)", value: "/*.jpg$, /*.png$, /*.gif$" },
  { label: "PDF files", value: "/*.pdf$" },
  { label: "Search results", value: "/search/" },
];

const CustomRuleBuilder: React.FC<CustomRuleBuilderProps> = ({ onAddRule }) => {
  const [permission, setPermission] = useState<AllowDisallow>('allow');
  const [path, setPath] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [selectedBots, setSelectedBots] = useState<string[]>(['All']);
  const [selectedPattern, setSelectedPattern] = useState<string>("");
  
  const toggleBot = (bot: string) => {
    if (bot === 'All') {
      setSelectedBots(['All']);
      return;
    }
    
    // If All is currently selected, remove it
    let newSelectedBots = selectedBots.filter(b => b !== 'All');
    
    // Toggle the selected bot
    if (newSelectedBots.includes(bot)) {
      newSelectedBots = newSelectedBots.filter(b => b !== bot);
    } else {
      newSelectedBots.push(bot);
    }
    
    // If no bots are selected, default to 'All'
    if (newSelectedBots.length === 0) {
      newSelectedBots = ['All'];
    }
    
    setSelectedBots(newSelectedBots);
  };
  
  const handlePatternChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedPattern(value);
    
    if (value) {
      setPath(value);
    }
  };
  
  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPath(e.target.value);
    setSelectedPattern("");
  };
  
  const handleAddRule = () => {
    if (!path.trim()) {
      alert("Please enter a path");
      return;
    }
    
    // Handle multiple paths separated by commas
    if (path.includes(',')) {
      const paths = path.split(',').map(p => p.trim()).filter(p => p);
      
      // Create a rule for each path
      paths.forEach(singlePath => {
        const newRule: RobotRule = {
          id: uuidv4(),
          bot: selectedBots,
          path: singlePath,
          permission,
          comment: comment ? comment : undefined,
        };
        
        onAddRule(newRule);
      });
    } else {
      const newRule: RobotRule = {
        id: uuidv4(),
        bot: selectedBots,
        path,
        permission,
        comment: comment ? comment : undefined,
      };
      
      onAddRule(newRule);
    }
    
    // Reset form
    setPath('');
    setComment('');
    setSelectedPattern("");
    setPermission('allow');
    setSelectedBots(['All']);
  };

  return (
    <Container>
      <Title>
        <FaPlus size={14} />
        Rule Builder
      </Title>
      
      <Description>
        Create specific rules to control how search engines interact with your site. 
        Each rule consists of targeted <GlossaryTermTooltip term="user-agent">User-agents</GlossaryTermTooltip>, 
        an <GlossaryTermTooltip term="allow">Allow</GlossaryTermTooltip> or 
        <GlossaryTermTooltip term="disallow">Disallow</GlossaryTermTooltip> directive, 
        and a path pattern.
      </Description>
      
      <Callout>
        <CalloutIcon>
          <FaLightbulb size={18} />
        </CalloutIcon>
        <CalloutContent>
          <strong>Pro Tip:</strong> Be specific with your paths. Using <GlossaryTermTooltip term="wildcards">wildcards</GlossaryTermTooltip> like 
          * and $ can help target multiple similar URLs. For example, <code>/*.pdf$</code> targets all PDF files.
        </CalloutContent>
      </Callout>
      
      <FormGroup>
        <Label>
          Which bots should this rule apply to?
          <Tooltip 
            content="Select 'All' to apply to all bots, or select specific bots. Multiple bots can be selected. Different search engines use different bots to crawl your site for different purposes."
            position="top"
          >
            <InfoIcon size={16} />
          </Tooltip>
        </Label>
        <BotSelector>
          {botOptions.map(bot => (
            <BotTag 
              key={bot} 
              $selected={selectedBots.includes(bot)}
              onClick={() => toggleBot(bot)}
            >
              {bot}
              {selectedBots.includes(bot) && <FaMinus size={10} />}
            </BotTag>
          ))}
        </BotSelector>
      </FormGroup>
      
      <FormGroup>
        <Label>
          Permission
          <Tooltip 
            content="'Allow' permits crawling of the specified paths. 'Disallow' prevents crawling. Note that 'Disallow' does not prevent indexing if other pages link to the content."
            position="top"
            maxWidth="300px"
          >
            <InfoIcon size={16} />
          </Tooltip>
        </Label>
        <Select 
          value={permission} 
          onChange={(e) => setPermission(e.target.value as AllowDisallow)}
          style={{ 
            color: permission === 'allow' ? '#10B981' : '#EF4444',
            fontWeight: 500
          }}
        >
          <option value="allow">Allow</option>
          <option value="disallow">Disallow</option>
        </Select>
      </FormGroup>
      
      <FormGroup>
        <Label>
          Path Pattern
          <Tooltip 
            content="Select a common pattern or create your own. You can use wildcards (*) to match any sequence of characters and $ to match the end of a URL. For example, '/*.pdf$' matches all PDF files."
            position="top"
            maxWidth="300px"
          >
            <InfoIcon size={16} />
          </Tooltip>
        </Label>
        <Select 
          value={selectedPattern} 
          onChange={handlePatternChange}
        >
          <option value="">Select a pattern or enter custom path below</option>
          {pathPatterns.map((pattern, index) => (
            <option key={index} value={pattern.value}>{pattern.label}</option>
          ))}
        </Select>
      </FormGroup>
      
      <FormGroup>
        <Label>
          Path
          <Tooltip 
            content="The URL path to allow or disallow. Use '/' for the entire site. Always include the leading slash. Separate multiple paths with commas. Use wildcards (*) for pattern matching."
            position="top"
            maxWidth="300px"
          >
            <InfoIcon size={16} />
          </Tooltip>
        </Label>
        <Input 
          type="text" 
          value={path} 
          onChange={handlePathChange}
          placeholder="e.g. /admin/, /*.pdf$, /wp-*"
        />
      </FormGroup>
      
      <FormGroup>
        <Label>
          Comment (optional)
          <Tooltip 
            content="Add a descriptive comment for this rule. Comments help document your robots.txt file and explain the purpose of each rule. They will be included in the robots.txt file prefixed with #."
            position="top"
            maxWidth="300px"
          >
            <InfoIcon size={16} />
          </Tooltip>
        </Label>
        <TextArea 
          value={comment} 
          onChange={(e) => setComment(e.target.value)}
          placeholder="e.g. Block access to admin area"
        />
      </FormGroup>
      
      <ButtonGroup>
        <Button 
          variant="primary" 
          onClick={handleAddRule}
          size="sm"
        >
          Add Rule
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default CustomRuleBuilder; 