'use client';

import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

const SemrushRecommendation = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 32px;
  text-align: center;
  margin: 32px auto;
  border: 1px solid #E5E7EB;
  max-width: 1128px;
  width: 100%;
`;

const SemrushLogo = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
`;

const SemrushTitle = styled.h2`
  font-size: 30px;
  font-weight: 700;
  color: #111827;
  margin: 16px 0;
`;

const SemrushText = styled.p`
  font-size: 16px;
  line-height: 1.5;
  color: #4B5563;
  margin-bottom: 24px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin: 24px auto;
  max-width: 1080px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ToolTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
  transition: color 0.2s ease;
`;

const ToolDescription = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: #4B5563;
`;

const ToolContent = styled.div`
  min-height: 100px;
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
`;

// Update the PreviewImage props interface
interface PreviewImageProps {
  $imageSrc: string;
}

// Update the PreviewImage styled component
const PreviewImage = styled.div<PreviewImageProps>`
  display: block;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  margin-top: 12px;
  border-radius: 6px;
  overflow: hidden;
  transition: transform 0.3s ease;
  background-image: url(${props => props.$imageSrc});
  background-size: cover;
  background-position: top center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-grow: 1;
`;

const ToolCard = styled.a`
  display: flex;
  flex-direction: column;
  padding: 16px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  text-decoration: none;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  height: 328.5px;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    background-color: #fff4f0;
    text-decoration: none;
  }
  
  &:hover ${ToolTitle} {
    color: #ff632b;
  }
`;

// Add TypeScript interface for the ToolCardWithPreview props
interface ToolCardWithPreviewProps {
  title: string;
  description: string;
  href: string;
  imageSrc: string;
}

// Update the ToolCardWithPreview component to use the props interface
const ToolCardWithPreview: React.FC<ToolCardWithPreviewProps> = ({ title, description, href, imageSrc }) => {
  return (
    <ToolCard href={href} target="_blank" rel="noopener noreferrer">
      <ToolContent>
        <ToolTitle>{title}</ToolTitle>
        <ToolDescription>{description}</ToolDescription>
      </ToolContent>
      <PreviewImage $imageSrc={imageSrc} />
    </ToolCard>
  );
};

const SemrushCTA = styled.a`
  display: inline-block;
  padding: 12px 24px;
  background-color: #FF642D;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #e85a29;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-decoration: none;
  }
`;

// Add TypeScript interface for the tools array items
interface Tool {
  name: string;
  description: string;
  imagePath: string;
  url: string;
}

const SemrushEffectivenessModule: React.FC = () => {
  const tools: Tool[] = [
    {
      name: 'Site Audit',
      description: 'Identify which pages your robots.txt is accidentally blocking from search engines.',
      imagePath: '/images/site-audit.webp',
      url: 'https://www.semrush.com/siteaudit/'
    },
    {
      name: 'Log File Analyzer',
      description: 'See exactly how search engines interact with your robots.txt directives.',
      imagePath: '/images/log-file-analyzer.webp',
      url: 'https://www.semrush.com/log-file-analyzer/'
    },
    {
      name: 'On Page SEO Checker',
      description: 'Ensure your robots.txt supports your SEO efforts for key pages.',
      imagePath: '/images/on-page-seo-checker.webp',
      url: 'https://www.semrush.com/on-page-seo-checker/'
    },
    {
      name: 'Organic Research',
      description: 'Discover which pages competitors allow search engines to crawl and index.',
      imagePath: '/images/organic_research.webp',
      url: 'https://www.semrush.com/analytics/organic/overview/?db=us'
    }
  ];

  return (
    <SemrushRecommendation>
      <SemrushLogo>
        <Image 
          src="/images/semrush-logo-black-font.png" 
          alt="Semrush Logo" 
          width={105.44} 
          height={28}
          quality={100}
        />
      </SemrushLogo>
      
      <SemrushTitle>Maximize Your Robots.txt Effectiveness</SemrushTitle>
      <SemrushText>
        Building a robots.txt file is just the start. Use Semrush's toolkit to track its impact on search engine crawling and optimize for better visibility and performance.
      </SemrushText>
      
      <ToolsGrid>
        {tools.map((tool, index) => (
          <ToolCardWithPreview 
            key={index}
            title={tool.name}
            description={tool.description}
            href={tool.url}
            imageSrc={tool.imagePath}
          />
        ))}
      </ToolsGrid>
      
      <SemrushCTA href="https://www.semrush.com/signup/" target="_blank" rel="noopener noreferrer">
        Try SEMrush for Free
      </SemrushCTA>
    </SemrushRecommendation>
  );
};

export default SemrushEffectivenessModule;