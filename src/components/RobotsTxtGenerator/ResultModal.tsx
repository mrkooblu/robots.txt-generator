'use client';

import React, { useRef } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import { FaClipboard, FaDownload, FaTimes, FaCode } from 'react-icons/fa';
import SyntaxValidator from './SyntaxValidator';

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
  
  &:hover {
    color: #111827;
  }
`;

const ResultModal: React.FC<ResultModalProps> = ({ isOpen, onClose, robotsTxt }) => {
  const [copySuccess, setCopySuccess] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'code' | 'validator'>('code');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

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
          <Tabs>
            <Tab 
              $active={activeTab === 'code'} 
              onClick={() => setActiveTab('code')}
            >
              <FaCode size={14} /> Code
            </Tab>
            <Tab 
              $active={activeTab === 'validator'} 
              onClick={() => setActiveTab('validator')}
            >
              <FaCode size={14} /> Syntax Validator
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
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ResultModal; 