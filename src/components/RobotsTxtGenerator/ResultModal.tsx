'use client';

import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import { FaClipboard, FaDownload, FaTimes, FaCode, FaCheck, FaExclamationTriangle, FaBook, FaStar } from 'react-icons/fa';
import SyntaxValidator from './SyntaxValidator';
import SemrushTip from '../common/SemrushTip';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  robotsTxt: string;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const ModalHeader = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid #E5E7EB;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6B7280;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #111827;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const CodeDisplay = styled.pre`
  background-color: #F9FAFB;
  border-radius: 6px;
  padding: 16px;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
  border: 1px solid #E5E7EB;
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
  justify-content: flex-end;
`;

const CopySuccessMessage = styled.span`
  color: #059669;
  font-size: 14px;
  margin-right: 16px;
  display: flex;
  align-items: center;
`;

const Note = styled.p`
  font-size: 14px;
  color: #6B7280;
  margin-top: 16px;
  line-height: 1.5;
  padding: 12px;
  background-color: #F9FAFB;
  border-radius: 6px;
  border-left: 4px solid #3B82F6;
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid #E5E7EB;
  margin-bottom: 16px;
  flex-wrap: wrap;
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
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  
  &:hover {
    color: #111827;
  }
`;

const TabIndicator = styled.span`
  position: absolute;
  top: -8px;
  right: -3px;
  background-color: #ff642d;
  color: white;
  font-size: 10px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: help;
  
  &:hover::after {
    content: 'Semrush SEO Tips Available';
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #1F2937;
    color: white;
    padding: 6px 10px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 10;
    font-weight: normal;
    letter-spacing: normal;
  }
  
  &:hover::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #1F2937 transparent transparent transparent;
    z-index: 10;
  }
`;

const TipContainer = styled.div`
  margin-top: 24px;
`;

const TipSection = styled.div`
  margin-bottom: 24px;
`;

const TipList = styled.ul`
  margin: 12px 0;
  padding-left: 20px;
`;

const TipItem = styled.li`
  margin-bottom: 16px;
  font-size: 14px;
  line-height: 1.5;
`;

const TipTitle = styled.h4`
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;

const TipContent = styled.p`
  margin-bottom: 8px;
  font-size: 14px;
  color: #4B5563;
`;

const SemrushLink = styled.a`
  color: #3B82F6;
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ExampleCode = styled.code`
  display: block;
  background-color: #F9FAFB;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #E5E7EB;
  font-family: monospace;
  font-size: 13px;
  line-height: 1.5;
  margin: 8px 0 16px 0;
  white-space: pre-wrap;
`;

const SemrushPromo = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #ff642d;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PromoIcon = styled.div`
  color: #ff642d;
  font-size: 1.5rem;
`;

const PromoContent = styled.div`
  flex: 1;
`;

const PromoHeading = styled.h4`
  margin: 0 0 4px 0;
  font-size: 16px;
  color: #333;
`;

const PromoText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #555;
`;

const PromoLink = styled.a`
  color: #ff642d;
  text-decoration: none;
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }
`;

const ResultModal: React.FC<ResultModalProps> = ({ isOpen, onClose, robotsTxt }) => {
  const [copySuccess, setCopySuccess] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'code' | 'validator'>('code');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  // Show a tip about site audit when modal opens
  useEffect(() => {
    // Any additional modal opening logic can go here
  }, [isOpen]);

  const copyToClipboard = () => {
    if (textAreaRef.current) {
      textAreaRef.current.select();
      document.execCommand('copy');
      setCopySuccess(true);
      
      setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
    }
  };

  // Create a download as a text file
  const downloadRobotsTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([robotsTxt], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'robots.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Generated robots.txt</ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        <ModalBody>
          <TipContainer>
            <SemrushTip trigger="general" />
          </TipContainer>
          
          <Tabs>
            <Tab
              type="button"
              $active={activeTab === 'code'}
              onClick={() => setActiveTab('code')}
            >
              <FaCode /> Code
            </Tab>
            <Tab
              type="button"
              $active={activeTab === 'validator'}
              onClick={() => setActiveTab('validator')}
            >
              <FaCode /> Syntax Validator
            </Tab>
          </Tabs>
        
          {activeTab === 'code' && (
            <>
              <CodeDisplay>{robotsTxt}</CodeDisplay>
              
              {/* Hidden textarea for copy functionality */}
              <textarea
                ref={textAreaRef}
                value={robotsTxt}
                style={{ position: 'absolute', left: '-9999px' }}
                readOnly
              />
              
              <Note>
                To use this robots.txt file, save it in the root directory of your website. Ensure it's accessible at yourdomain.com/robots.txt.
              </Note>
            </>
          )}
          
          {activeTab === 'validator' && (
            <SyntaxValidator robotsTxt={robotsTxt} />
          )}
          
          <ActionButtons>
            {copySuccess && <CopySuccessMessage>✓ Copied to clipboard!</CopySuccessMessage>}
            <Button 
              variant="outline" 
              onClick={copyToClipboard}
              icon={<FaClipboard />}
            >
              Copy to Clipboard
            </Button>
            <Button 
              variant="primary" 
              onClick={downloadRobotsTxt}
              icon={<FaDownload />}
            >
              Download robots.txt
            </Button>
          </ActionButtons>
          
          <SemrushPromo>
            <PromoIcon><FaStar /></PromoIcon>
            <PromoContent>
              <PromoHeading>Optimize your robots.txt file with Semrush</PromoHeading>
              <PromoText>
                Get deeper insights into how search engines crawl your site. Improve your website's SEO performance with Semrush's Site Audit tool.{' '}
                <PromoLink href="https://www.semrush.com/site-audit/" target="_blank" rel="noopener noreferrer">
                  Try it free &rarr;
                </PromoLink>
              </PromoText>
            </PromoContent>
          </SemrushPromo>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ResultModal; 