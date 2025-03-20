'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TipTrigger } from '@/data/TipsData';

interface TipContextType {
  currentTrigger: TipTrigger;
  setCurrentTrigger: (trigger: TipTrigger) => void;
  showInlineTip: boolean;
  setShowInlineTip: (show: boolean) => void;
  inlineTipTrigger: TipTrigger;
  showInlineTipWithTrigger: (trigger: TipTrigger) => void;
  dismissedTips: string[];
  dismissTip: (tipId: string) => void;
  resetDismissedTips: () => void;
}

const TipContext = createContext<TipContextType | undefined>(undefined);

export const TipProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrigger, setCurrentTrigger] = useState<TipTrigger>('general');
  const [showInlineTip, setShowInlineTip] = useState(false);
  const [inlineTipTrigger, setInlineTipTrigger] = useState<TipTrigger>('general');
  const [dismissedTips, setDismissedTips] = useState<string[]>([]);
  
  // Initialize dismissed tips from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDismissedTips = localStorage.getItem('dismissedTips');
      if (savedDismissedTips) {
        try {
          setDismissedTips(JSON.parse(savedDismissedTips));
        } catch (error) {
          console.error('Error parsing dismissed tips from localStorage', error);
        }
      }
    }
  }, []);
  
  // Save dismissed tips to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dismissedTips', JSON.stringify(dismissedTips));
    }
  }, [dismissedTips]);
  
  const showInlineTipWithTrigger = (trigger: TipTrigger) => {
    setInlineTipTrigger(trigger);
    setShowInlineTip(true);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      setShowInlineTip(false);
    }, 10000);
  };
  
  const dismissTip = (tipId: string) => {
    setDismissedTips([...dismissedTips, tipId]);
  };
  
  const resetDismissedTips = () => {
    setDismissedTips([]);
  };
  
  return (
    <TipContext.Provider
      value={{
        currentTrigger,
        setCurrentTrigger,
        showInlineTip,
        setShowInlineTip,
        inlineTipTrigger,
        showInlineTipWithTrigger,
        dismissedTips,
        dismissTip,
        resetDismissedTips
      }}
    >
      {children}
    </TipContext.Provider>
  );
};

export const useTips = (): TipContextType => {
  const context = useContext(TipContext);
  
  if (context === undefined) {
    throw new Error('useTips must be used within a TipProvider');
  }
  
  return context;
};

export default TipContext; 