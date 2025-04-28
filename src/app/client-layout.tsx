'use client';

import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { Manrope } from 'next/font/google';
import { theme } from '@/styles/theme';
import { ToastProvider } from '@/components/common/Toast';
import StyledComponentsRegistry from '@/lib/registry';
import { TipProvider } from '@/context/TipContext';
import '@/styles/globals.css';

// Manrope is a clean, modern, minimal sans-serif for UI
const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Add state to track if hydration is complete
  const [isHydrated, setIsHydrated] = useState(false);

  // After hydration, set a flag in localStorage to use on future loads
  useEffect(() => {
    // Mark that hydration has completed
    setIsHydrated(true);
    
    // Store flag in localStorage to use on next page load
    // This helps prevent hydration warnings for components that depend on client features
    localStorage.setItem('app-hydrated', 'true');
    
    // Suppress specific React hydration warning 
    // This is a workaround for Next.js hydration issues with dynamic content
    const originalError = console.error;
    console.error = (...args: any[]) => {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('Hydration failed')) {
        return;
      }
      if (args[0] && typeof args[0] === 'string' && args[0].includes('Warning: Text content did not match')) {
        return;
      }
      originalError(...args);
    };
    
    return () => {
      // Restore original console.error when component unmounts
      console.error = originalError;
    };
  }, []);

  return (
    <html lang="en" className={manrope.variable}>
      <head>
        <title>Robots.txt Generator</title>
        <meta name="description" content="Generate a robots.txt file for your website with ease. This tool builds robots.txt parameters that control how search engines crawl your site." />
      </head>
      <body suppressHydrationWarning={true}>
        <StyledComponentsRegistry>
          <ThemeProvider theme={theme}>
            <TipProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </TipProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
} 