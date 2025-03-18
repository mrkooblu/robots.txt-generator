'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { FaLightbulb, FaExclamationTriangle, FaBookOpen, FaArrowRight } from 'react-icons/fa';
import Tooltip from '../common/Tooltip';

// Types for educational content
type TutorialStep = {
  title: string;
  content: string;
  example: string;
  image?: string;
};

type BestPractice = {
  title: string;
  description: string;
  example: string;
};

type CommonMistake = {
  mistake: string;
  explanation: string;
  correction: string;
};

type RealWorldExample = {
  siteName: string;
  description: string;
  robotsTxtSnippet: string;
};

const Container = styled.div`
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 24px;
`;

const Tabs = styled.div`
  display: flex;
  background-color: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: 768px) {
    padding-bottom: 4px;
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 12px 16px;
  background: ${props => props.$active ? '#FFFFFF' : 'transparent'};
  border: none;
  color: ${props => props.$active ? '#111827' : '#6B7280'};
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 48px; /* Ensure good touch target size */
  white-space: nowrap;
  
  &:hover {
    color: #111827;
    background-color: ${props => props.$active ? '#FFFFFF' : '#F3F4F6'};
  }
  
  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 14px;
  }
  
  @media (max-width: 480px) {
    font-size: 13px;
    padding: 8px 10px;
    
    /* Hide text label and just show icon on very small screens */
    & > span {
      display: none;
    }
    
    /* Center the icon */
    justify-content: center;
    min-width: 40px;
  }
`;

const ContentContainer = styled.div`
  padding: 24px;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const Title = styled.h2`
  font-size: ${props => props.theme.heading.h2.fontSize};
  line-height: ${props => props.theme.heading.h2.lineHeight};
  font-weight: ${props => props.theme.heading.h2.fontWeight};
  margin: 0 0 16px 0;
  color: ${props => props.theme.colors.text.primary};
`;

const Description = styled.div`
  font-size: 14px;
  color: #4B5563;
  line-height: 1.5;
  margin-bottom: 16px;
`;

const InteractiveTutorial = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const TutorialStep = styled.div`
  background-color: #F9FAFB;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #3B82F6;
`;

const StepTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
`;

const StepContent = styled.div`
  font-size: 14px;
  color: #4B5563;
  line-height: 1.5;
  margin-bottom: 12px;
`;

const CodeExample = styled.div`
  background-color: #1F2937;
  color: #F9FAFB;
  border-radius: 6px;
  padding: 12px;
  font-family: monospace;
  font-size: 13px;
  white-space: pre-wrap;
  margin: 12px 0;
  overflow-x: auto;
`;

const PracticesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PracticeItem = styled.div`
  background-color: #F0FDF4;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #10B981;
`;

const MistakesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const MistakeItem = styled.div`
  background-color: #FEF2F2;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #EF4444;
`;

const ExampleCard = styled.div`
  background-color: #F9FAFB;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #E5E7EB;
  margin-bottom: 16px;
`;

const ExampleTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  
  @media (max-width: 480px) {
    margin-top: 16px;
  }
`;

const NavigationButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #F3F4F6;
  color: #111827;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 44px; /* Good touch target size */
  
  &:hover {
    background-color: #E5E7EB;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 14px;
    flex: 1;
    justify-content: center;
  }
`;

// Tutorial steps data
const tutorialSteps: TutorialStep[] = [
  {
    title: 'Understanding User-agent',
    content: 'The User-agent line specifies which web crawler the rules apply to. You can target specific crawlers or use * to target all crawlers.',
    example: 'User-agent: Googlebot\nUser-agent: *'
  },
  {
    title: 'Allow and Disallow Directives',
    content: 'Allow specifies which URLs can be crawled, while Disallow specifies which URLs cannot be crawled. You must include at least one directive.',
    example: 'Disallow: /admin/\nAllow: /products/'
  },
  {
    title: 'Using Wildcards',
    content: 'You can use the * wildcard to match any sequence of characters and $ to match the end of a URL.',
    example: 'Disallow: /*.pdf$\nDisallow: /private*'
  },
  {
    title: 'Sitemap Directive',
    content: 'The Sitemap directive tells search engines where to find your sitemap file, which helps them discover pages on your site.',
    example: 'Sitemap: https://www.example.com/sitemap.xml'
  },
  {
    title: 'Comments',
    content: 'You can add comments to your robots.txt file to document your rules. Comments start with #.',
    example: '# This is a comment\nUser-agent: *\nDisallow: /private/'
  }
];

// Best practices data
const bestPractices: BestPractice[] = [
  {
    title: 'Be Specific with User-Agents',
    description: 'Target specific crawlers when possible for more precise control over how different bots interact with your site.',
    example: 'User-agent: Googlebot\nDisallow: /sensitive-content/\n\nUser-agent: Bingbot\nDisallow: /different-content/'
  },
  {
    title: 'Differentiate Allow and Disallow',
    description: 'Use Allow to explicitly permit access to subdirectories of a disallowed directory. This creates more precise access rules.',
    example: 'User-agent: *\nDisallow: /private/\nAllow: /private/public-page.html'
  },
  {
    title: 'Always Include a Sitemap',
    description: 'Always include a sitemap directive to help search engines discover all important pages, particularly on large sites.',
    example: 'Sitemap: https://www.example.com/sitemap.xml'
  },
  {
    title: 'Test Before Deploying',
    description: 'Always test your robots.txt file using testing tools provided by search engines before deploying it to your live site.',
    example: 'Use Google\'s robots.txt testing tool in Search Console'
  },
  {
    title: 'Don\'t Block CSS or JavaScript',
    description: 'Allow search engines to access CSS and JavaScript files so they can properly render and understand your pages.',
    example: '# Good practice - don\'t do this:\n# User-agent: *\n# Disallow: /css/\n# Disallow: /js/'
  }
];

// Common mistakes data
const commonMistakes: CommonMistake[] = [
  {
    mistake: 'Using robots.txt for privacy',
    explanation: 'robots.txt is a guideline, not a security measure. Pages disallowed may still be indexed if linked to.',
    correction: 'Use meta robots tags, password protection, or .htaccess for private content.'
  },
  {
    mistake: 'Blocking entire site unintentionally',
    explanation: 'A simple typo like "Disallow: /" will block your entire site from being crawled.',
    correction: 'Always test your robots.txt file before deploying, and be specific with paths.'
  },
  {
    mistake: 'Forgetting the leading slash',
    explanation: 'Forgetting the leading slash in paths can lead to unexpected behavior or rules not being applied correctly.',
    correction: 'Always include the leading slash: "Disallow: /private/" not "Disallow: private/"'
  },
  {
    mistake: 'Using incorrect syntax',
    explanation: 'robots.txt has specific formatting requirements. Incorrect formatting can cause rules to be ignored.',
    correction: 'Follow standard syntax: User-agent, followed by Allow/Disallow directives, with one directive per line.'
  },
  {
    mistake: 'Contradictory or conflicting rules',
    explanation: 'Having contradictory rules like allowing and disallowing the same path can lead to unexpected behavior.',
    correction: 'Audit your rules for conflicts, and organize them logically by user-agent.'
  }
];

// Real-world examples
const realWorldExamples: RealWorldExample[] = [
  {
    siteName: 'E-commerce Site',
    description: 'A typical configuration for an e-commerce site, allowing product pages while protecting admin and checkout flows',
    robotsTxtSnippet: `User-agent: *
Disallow: /checkout/
Disallow: /cart/
Disallow: /admin/
Disallow: /account/
Allow: /products/
Sitemap: https://www.ecommercesite.com/sitemap.xml`
  },
  {
    siteName: 'Blog or Content Site',
    description: 'Configuration for a content-focused site, allowing most content while protecting draft and private articles',
    robotsTxtSnippet: `User-agent: *
Disallow: /wp-admin/
Disallow: /drafts/
Disallow: /private/
Disallow: /*/feed/
Allow: /wp-admin/admin-ajax.php
Sitemap: https://www.contentsite.com/sitemap.xml`
  },
  {
    siteName: 'Corporate Website',
    description: 'A corporate website configuration that protects internal documents while allowing public information',
    robotsTxtSnippet: `User-agent: *
Disallow: /internal/
Disallow: /employees/
Disallow: /investors/private/
Allow: /investors/public/
Sitemap: https://www.corporation.com/sitemap.xml`
  }
];

const EducationalContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tutorial');
  const [currentStep, setCurrentStep] = useState(0);
  
  const handleNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  return (
    <Container>
      <Tabs>
        <Tab 
          $active={activeTab === 'tutorial'} 
          onClick={() => setActiveTab('tutorial')}
        >
          <FaBookOpen /> <span>Interactive Tutorial</span>
        </Tab>
        <Tab 
          $active={activeTab === 'best-practices'} 
          onClick={() => setActiveTab('best-practices')}
        >
          <FaLightbulb /> <span>Best Practices</span>
        </Tab>
        <Tab 
          $active={activeTab === 'common-mistakes'} 
          onClick={() => setActiveTab('common-mistakes')}
        >
          <FaExclamationTriangle /> <span>Common Mistakes</span>
        </Tab>
        <Tab 
          $active={activeTab === 'examples'} 
          onClick={() => setActiveTab('examples')}
        >
          <FaBookOpen /> <span>Real-world Examples</span>
        </Tab>
      </Tabs>
      
      <ContentContainer>
        {activeTab === 'tutorial' && (
          <>
            <Title>Interactive Tutorial: Understanding robots.txt</Title>
            <Description>
              Learn how to create effective robots.txt files with this step-by-step tutorial.
              Each step explains a key concept with examples.
            </Description>
            
            <InteractiveTutorial>
              <TutorialStep>
                <StepTitle>Step {currentStep + 1}: {tutorialSteps[currentStep].title}</StepTitle>
                <StepContent>{tutorialSteps[currentStep].content}</StepContent>
                <CodeExample>{tutorialSteps[currentStep].example}</CodeExample>
              </TutorialStep>
              
              <NavigationButtons>
                <NavigationButton 
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                >
                  Previous
                </NavigationButton>
                <NavigationButton 
                  onClick={handleNextStep}
                  disabled={currentStep === tutorialSteps.length - 1}
                >
                  Next <FaArrowRight />
                </NavigationButton>
              </NavigationButtons>
            </InteractiveTutorial>
          </>
        )}
        
        {activeTab === 'best-practices' && (
          <>
            <Title>Best Practices for robots.txt</Title>
            <Description>
              Follow these best practices to ensure your robots.txt file is effective and properly configured.
            </Description>
            
            <PracticesList>
              {bestPractices.map((practice, index) => (
                <PracticeItem key={index}>
                  <StepTitle>{practice.title}</StepTitle>
                  <StepContent>{practice.description}</StepContent>
                  <CodeExample>{practice.example}</CodeExample>
                </PracticeItem>
              ))}
            </PracticesList>
          </>
        )}
        
        {activeTab === 'common-mistakes' && (
          <>
            <Title>Common Mistakes to Avoid</Title>
            <Description>
              Watch out for these common mistakes when creating your robots.txt file.
            </Description>
            
            <MistakesList>
              {commonMistakes.map((mistake, index) => (
                <MistakeItem key={index}>
                  <StepTitle>{mistake.mistake}</StepTitle>
                  <StepContent>{mistake.explanation}</StepContent>
                  <StepContent><strong>Solution:</strong> {mistake.correction}</StepContent>
                </MistakeItem>
              ))}
            </MistakesList>
          </>
        )}
        
        {activeTab === 'examples' && (
          <>
            <Title>Real-world Examples</Title>
            <Description>
              These examples show how different types of websites typically configure their robots.txt files.
            </Description>
            
            {realWorldExamples.map((example, index) => (
              <ExampleCard key={index}>
                <ExampleTitle>{example.siteName}</ExampleTitle>
                <StepContent>{example.description}</StepContent>
                <CodeExample>{example.robotsTxtSnippet}</CodeExample>
              </ExampleCard>
            ))}
          </>
        )}
      </ContentContainer>
    </Container>
  );
};

export default EducationalContent; 