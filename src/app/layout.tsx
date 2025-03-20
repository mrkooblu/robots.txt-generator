'use client';

import React from 'react';
import { Manrope } from 'next/font/google';
import { ThemeProvider } from '../context/ThemeContext';
import { TipProvider } from '../context/TipContext';
import '../styles/globals.css';
import StyledComponentsRegistry from '../lib/registry';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Robots.txt Generator</title>
        <meta name="description" content="Generate a robots.txt file for your website with ease. This tool builds robots.txt parameters that control how search engines crawl your site." />
      </head>
      <body className={manrope.className}>
        <ThemeProvider>
          <StyledComponentsRegistry>
            <TipProvider>
              {children}
            </TipProvider>
          </StyledComponentsRegistry>
        </ThemeProvider>
      </body>
    </html>
  );
} 