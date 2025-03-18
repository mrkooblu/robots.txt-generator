'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import lightTheme from '../styles/theme';
import GlobalStyle from '../styles/GlobalStyle';

// Simplified context with only light theme
interface ThemeContextType {
  themeMode: 'light';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Always use light theme
  const themeMode = 'light';
  
  return (
    <ThemeContext.Provider value={{ themeMode }}>
      <StyledThemeProvider theme={lightTheme}>
        <GlobalStyle />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
}; 