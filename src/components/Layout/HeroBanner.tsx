'use client';

import React from 'react';
import styled from 'styled-components';

interface HeroBannerProps {
  title: string;
  description: string;
}

// Main header container that spans the full width
const HeaderSection = styled.div`
  position: relative;
  margin-bottom: 2.5rem;
  height: 425px;
  display: flex;
  align-items: center;
  background: #121737 url('/images/tools-background.svg') no-repeat center center;
  background-size: cover;
  width: 100%;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 350px;
    margin-bottom: 1.5rem;
  }
`;

// Container to center content and control max-width
const AppContainer = styled.div`
  max-width: 1128px;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

// Content wrapper for hero text elements
const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  margin: 0;
  padding: 0;
  text-align: left;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

// Main title styling
const MainTitle = styled.h1`
  font-family: 'Manrope', sans-serif;
  font-size: 44px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 2rem;
  line-height: 1.3;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
  }
`;

// Description text styling
const Description = styled.p`
  font-family: 'Manrope', sans-serif;
  color: rgba(255, 255, 255, 0.8);
  font-size: 18px;
  line-height: 1.8;
  margin-bottom: 2.5rem;
  max-width: 750px;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
    line-height: 1.6;
  }
`;

const HeroBanner: React.FC<HeroBannerProps> = ({ title, description }) => {
  return (
    <HeaderSection>
      <AppContainer>
        <HeroContent>
          <MainTitle>{title}</MainTitle>
          <Description>{description}</Description>
        </HeroContent>
      </AppContainer>
    </HeaderSection>
  );
};

export default HeroBanner; 