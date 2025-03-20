'use client';

import React from 'react';
import Layout from '../components/Layout/Layout';
import RobotsTxtGenerator from '../components/RobotsTxtGenerator/RobotsTxtGenerator';
import SemrushEffectivenessModule from '@/components/SemrushEffectivenessModule';

export default function Home() {
  return (
    <Layout>
      <RobotsTxtGenerator />
      <SemrushEffectivenessModule />
    </Layout>
  );
} 