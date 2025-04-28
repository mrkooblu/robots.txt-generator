'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { RobotRule, AllowDisallow } from './RobotsTxtGenerator';
import { FaArrowsAlt, FaEdit, FaTrash } from 'react-icons/fa';
import Tooltip from '../common/Tooltip';

interface DraggableRuleListProps {
  rules: RobotRule[];
  onRulesChange: (rules: RobotRule[]) => void;
  onEditRule: (id: string) => void;
  onDeleteRule: (id: string) => void;
}

const Container = styled.div`
  margin-bottom: 24px;
`;

const ListContainer = styled.div`
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  overflow: hidden;
`;

const NoRulesMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #6B7280;
  font-style: italic;
`;

const RuleItem = styled.div<{ $isDragging: boolean }>`
  display: flex;
  align-items: center;
  padding: 14px 16px;
  background-color: ${props => props.$isDragging ? '#EFF6FF' : 'white'};
  border-bottom: 1px solid #E5E7EB;
  transition: background-color 0.2s;
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    padding: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 16px 12px; /* More vertical space on mobile */
    flex-direction: column;
    align-items: flex-start;
  }
`;

const DragHandle = styled.div`
  cursor: grab;
  color: #9CA3AF;
  padding: 4px;
  margin-right: 12px;
  border-radius: 4px;
  
  &:hover {
    background-color: #F3F4F6;
  }
  
  @media (max-width: 480px) {
    position: absolute;
    right: 12px;
    top: 12px;
    margin-right: 0;
    padding: 8px; /* Larger touch target */
  }
`;

const RuleContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  overflow: hidden;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
`;

const RuleInfo = styled.div`
  flex: 1;
  overflow: hidden;
  
  @media (max-width: 480px) {
    width: 100%;
    margin-top: 8px;
  }
`;

const RulePath = styled.div`
  font-weight: 500;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RuleDetails = styled.div`
  font-size: 13px;
  color: #6B7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-left: 10px;
  
  @media (max-width: 480px) {
    margin-left: 0;
    margin-top: 12px;
    width: 100%;
    justify-content: flex-start;
  }
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  color: #6B7280;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #F3F4F6;
    color: #111827;
  }
  
  @media (max-width: 480px) {
    padding: 8px 12px; /* Larger touch target */
    
    /* Add labels on mobile for better UX */
    &::after {
      content: attr(data-label);
      margin-left: 6px;
      font-size: 14px;
    }
  }
`;

const Permission = styled.span<{ permission: AllowDisallow }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  margin-right: 12px;
  background-color: ${props => props.permission === 'allow' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.permission === 'allow' ? '#059669' : '#DC2626'};
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
`;

// Helper function to safely display comment content
const sanitizeComment = (comment?: string): string => {
  if (!comment) return '';
  
  // Basic sanitization to prevent XSS
  return comment
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .substring(0, 80) + (comment.length > 80 ? '...' : '');
};

const DraggableRuleList: React.FC<DraggableRuleListProps> = ({
  rules,
  onRulesChange,
  onEditRule,
  onDeleteRule
}) => {
  // State to manage strict mode double mounting
  const [enabled, setEnabled] = useState(false);

  // Enable drag and drop after the component mounts to avoid strict mode issues
  useEffect(() => {
    const timeout = setTimeout(() => {
      setEnabled(true);
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(rules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onRulesChange(items);
  };
  
  // Format bot names for display
  const formatBotNames = (bots: string[]) => {
    if (bots.includes('All')) return 'All bots';
    if (bots.length <= 2) return bots.join(', ');
    return `${bots[0]}, ${bots[1]}, +${bots.length - 2} more`;
  };

  return (
    <Container>
      <Title>Rules ({rules.length})</Title>
      {enabled ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="rules" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
            {(provided) => (
              <ListContainer 
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {rules.length === 0 ? (
                  <NoRulesMessage>No rules added yet. Use the Rule Builder to add rules.</NoRulesMessage>
                ) : (
                  rules.map((rule, index) => (
                    <Draggable key={rule.id} draggableId={rule.id} index={index}>
                      {(provided, snapshot) => (
                        <RuleItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          $isDragging={snapshot.isDragging}
                        >
                          <DragHandle {...provided.dragHandleProps}>
                            <FaArrowsAlt />
                          </DragHandle>
                          <RuleContent>
                            <Permission permission={rule.permission}>
                              {rule.permission === 'allow' ? 'Allow' : 'Disallow'}
                            </Permission>
                            <RuleInfo>
                              <RulePath>{rule.path}</RulePath>
                              <RuleDetails>
                                <span>{formatBotNames(rule.bot)}</span>
                                {rule.comment && (
                                  <Tooltip 
                                    content={sanitizeComment(rule.comment)} 
                                    position="bottom"
                                  >
                                    <span> • <em>Has comment</em></span>
                                  </Tooltip>
                                )}
                              </RuleDetails>
                            </RuleInfo>
                            <ActionButtons>
                              <Tooltip content="Edit rule" position="top">
                                <ActionButton 
                                  onClick={() => onEditRule(rule.id)} 
                                  type="button"
                                  data-label="Edit"
                                >
                                  <FaEdit />
                                </ActionButton>
                              </Tooltip>
                              <Tooltip content="Delete rule" position="top">
                                <ActionButton 
                                  onClick={() => onDeleteRule(rule.id)} 
                                  type="button"
                                  data-label="Delete"
                                >
                                  <FaTrash />
                                </ActionButton>
                              </Tooltip>
                            </ActionButtons>
                          </RuleContent>
                        </RuleItem>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </ListContainer>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <ListContainer>
          {rules.length === 0 ? (
            <NoRulesMessage>No rules added yet. Use the Rule Builder to add rules.</NoRulesMessage>
          ) : (
            rules.map((rule) => (
              <RuleItem key={rule.id} $isDragging={false}>
                <DragHandle>
                  <FaArrowsAlt />
                </DragHandle>
                <RuleContent>
                  <Permission permission={rule.permission}>
                    {rule.permission === 'allow' ? 'Allow' : 'Disallow'}
                  </Permission>
                  <RuleInfo>
                    <RulePath>{rule.path}</RulePath>
                    <RuleDetails>
                      <span>{formatBotNames(rule.bot)}</span>
                      {rule.comment && (
                        <Tooltip 
                          content={sanitizeComment(rule.comment)} 
                          position="bottom"
                        >
                          <span> • <em>Has comment</em></span>
                        </Tooltip>
                      )}
                    </RuleDetails>
                  </RuleInfo>
                  <ActionButtons>
                    <Tooltip content="Edit rule" position="top">
                      <ActionButton 
                        onClick={() => onEditRule(rule.id)} 
                        type="button"
                        data-label="Edit"
                      >
                        <FaEdit />
                      </ActionButton>
                    </Tooltip>
                    <Tooltip content="Delete rule" position="top">
                      <ActionButton 
                        onClick={() => onDeleteRule(rule.id)} 
                        type="button"
                        data-label="Delete"
                      >
                        <FaTrash />
                      </ActionButton>
                    </Tooltip>
                  </ActionButtons>
                </RuleContent>
              </RuleItem>
            ))
          )}
        </ListContainer>
      )}
    </Container>
  );
};

export default DraggableRuleList; 