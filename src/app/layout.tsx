// This is a server component (no 'use client' directive)
import { ReactNode } from 'react';
import { metadata } from './metadata';
import ClientLayout from './client-layout';

export { metadata };

export default function RootLayout({ children }: { children: ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
} 